//
// LIS Sequence Search
//
// Client side Blast result visualization library.
//
// Dependencies:
//  Underscore.js
//  d3.js
//  jQuery
//
// Author: Ken Seal
//---------------------------------------------------------------------------//

var LSS = LSS || {};

//
// General purpose namespace method for LSS object.
//
// This method is nondestructive. If a namespace exists, it won't be
// re-created.
//
LSS.namespace = function(ns) {

  var self = this,
      parts = ns.split('.'),
      parent = LSS,
      i;

  if (parts[0] === "LSS") {
    parts = parts.slice(1);
  }

  for (i = 0; i < parts.length; i += 1) {
    if (_.isUndefined(parent[parts[i]])) {
      parent[parts[i]] = {};
    }
    parent = parent[parts[i]];
  }

  return parent;

};

//
// Cache the datasets returned from Quorum.
//
LSS.data = LSS.data || {};

//
// Store empty blast reports.
//
LSS.emptyReports = LSS.emptyReports || [];

//
// Store the visible leaf node data.
//
LSS.leaf_data = LSS.leaf_data || {};

//
// Store enquequed algorithms.
//
LSS.algos = LSS.algos || [];

//
// Number of supported algorithms set by QUORUM.
//
LSS.numSupportedAlgos = QUORUM.algorithms.length;

//
// Highlight the selected view (table, partition, etc.).
//
LSS.highlightView = function(el) {

  var self = this,
      class_name = "ui-state-highlight";

  $("#views li").each(function() {
    $(this).removeClass(class_name);
  });

  $(el).addClass(class_name);

};

//
// Flag top hit per sequence query by adding property "top_hit:true" to each
// object.
//
// Quorum returns results ordered by query, bit_score ascending so it's safe
// to flag the first hit to each query as a top hit.
//
LSS.flagTopHitPerQuery = function(data) {

  var self = this,
      query;

  // Quorum returns data in this oder.
  _.each(data, function(d) {
    if (query !== d.query) {
      _.extend(d, { "top_hit": true });
      query = d.query;
    }
  });

  return data;

};

//
// Expand top hit per query sequence.
//
LSS.expandTopHits = function() {

  var self = this,
      algos = self.algos,
      cached = "cached",
      data = [];

  if (_.isEmpty(algos)) {
    return;
  }

  // Remove each object without a top_hit property.
  _.each(algos, function(a) {
    data.push(_.reject(self.data[a], function(d) {
      return _.isUndefined(d.top_hit);
    }));
  });

  // Cache the result for further filtering.
  self.data[cached] = data;

  self.getFilterValues();

};

//
// Expand top hit per reference sequence.
//
LSS.expandTopHitPerRefSeq = function() {

  var self = this,
      algos = self.algos,
      cached = "cached",
      found,
      tmp = [],
      ref = [];

  if (_.isEmpty(algos)) {
    return;
  }

  _.each(algos, function(a) {
    _.each(self.data[a], function(d) {
      if (!_.isNull(d.hit_display_id)) {
        found = _.find(tmp, function(t) {
          return t.hit_display_id === d.hit_display_id && t.query === d.query;
        });
        if (!found) {
          tmp.push(d);
        }
      }
    });
    ref.push(tmp);
    tmp = [];
  });

  // Cache the result for further filtering.
  self.data[cached] = ref;

  self.getFilterValues();

};

//
// Expand top hit per reference.
//
LSS.expandTopHitPerRef = function() {

  var self = this,
      algos = self.algos,
      cached = "cached",
      found,
      tmp = [],
      ref = [];

  // Return if algos is empty.
  if (_.isEmpty(algos)) {
    return;
  }

  _.each(algos, function(a) {
    _.each(self.data[a], function(d) {
      if (!_.isNull(d.hit_display_id)) {
        found = _.find(tmp, function(t) {
          return t.ref === d.ref && t.query === d.query;
        });
        if (!found) {
          tmp.push(d);
        }
      }
    });
    ref.push(tmp);
    tmp = [];
  });

  // Cache the result for further filtering.
  self.data[cached] = ref;

  self.getFilterValues();

};

//
// Remove filters by expanding tree using original dataset.
//
LSS.removeFilters = function() {

  var self = this,
      algos = self.algos,
      cached = "cached";

  // Return if algos is empty.
  if (_.isEmpty(algos)) {
    return;
  }

  // Destroy any cached data.
  self.data[cached] = null;

  self.renderView(null);

};

//
// Returns object containing filter value properties.
//
LSS.getFilterValues = function() {

  var self = this,
      props = {},
      values = ["bit_score", "evalue"];

  _.each(values, function(v) {
    if (!_.isEmpty($("#" + v).val())) {
      props[v] = $("#" + v).val();
    }
  });

  self.filterFieldsByValue(props);

};

//
// Filter data property field by value.
//
// Performs the filter on the cached data if applicable.
//
LSS.filterFieldsByValue = function(props) {

  var self = this,
      algos = self.algos,
      data,
      tmp = [],
      i,
      operators;

  // Return if algos is empty.
  if (_.isEmpty(algos)) {
    return;
  }

  data = self.setCurrentData();

  if (_.isEmpty(props)) {
    return self.renderView(data);
  }

  // Filter operators.
  operators = {
    bit_score: '<',
    evalue: '>',
    undefined: '<'
  };

  for (i = 0; i < algos.length; i++) {
    tmp.push(_.reject(data[i], function(d) {
      var ret = false;
      _.each(props, function(v, k) {
        if (!ret) {
          ret = eval("parseFloat(d[k]) " + operators[k] + " parseFloat(v)");
        }
      });
      return ret;
    }));
  }

  self.renderView(tmp);

}

//
// Render both partition and table views.
//
LSS.renderDualView = function(data) {

  var self = this,
      partition = "#partition-results",
      table = "#table-results";

  self.renderPartition(data, true);
  self.renderTable(data);

  $(table).css('height', (window.innerHeight * 0.4));

};

//
// Renders an interactive d3 partition view.
//
LSS.renderPartition = function(data, dualView) {

  var self = this,
      dualView = dualView || false,
      cached = "cached",
      results = "#partition-results",
      margin = { top: 20, right: 20, bottom: 20, left: 60 },
      width = $(results).width() - margin.right - margin.left,
      height = (window.innerHeight * 0.65) - margin.top - margin.bottom,
      x = d3.scale.linear().range([0, width]),
      y = d3.scale.linear().range([0, height]),
      formatted,
      root,
      partition,
      vis,
      g,
      t,
      kx,
      ky;

  $(results).empty();

  self.leaf_data = {};

  data = self.setData(data);

  // Stuff data into a nested JSON.
  formatted = self.formatResults(data);

  // Set root to formatted for partition view.
  root = formatted;

  vis = d3.select(results).append("div")
    .attr("class", "partition")
    .style("width", width + "px")
    .style("height", height + "px")
    .append("svg:svg")
    .attr("width", width)
    .attr("height", height);

  partition = d3.layout.partition()
    .value(function(d) { return d.size; });

  g = vis.selectAll("g")
    .data(partition.nodes(formatted))
    .enter().append("svg:g")
    .attr("class", "partition-node")
    .attr("transform", function(d) {
      return "translate(" + x(d.y) + "," + y(d.x) + ")";
    })
    .on("click", click);

  kx = width / formatted.dx;
  ky = height / 1;

  g.append("svg:rect")
    .attr("width", formatted.dy * kx)
    .attr("height", function(d) { return d.dx * ky; })
    .attr("class", function(d) { return d.children ? "parent" : "child"; })
    .on("click", function(d) { click(d); });

  g.append("svg:text")
    .attr("transform", function(d) { return "translate(8," + d.dx * ky / 2 + ")"; })
    .attr("dy", ".35em")
    .style("opacity", function(d) { return d.dx * ky > 12 ? 1 : 0; })
    .text(function(d) { return d.name; })
    .on("click", function(d) { return click(d); })
    .attr("class", function(d) {
      var r = "";
      if (d.top_hit) {
        r = "top-hit pointer";
      } else {
        r = "pointer";
      }
      return r;
    });

  // Zoom in on the clicked node.
  function click(d) {
    if (!d.children) {
      if (d.quorum_hit_id) {
        return QUORUM.viewDetailedReport(d.quorum_hit_id, d.query, d.algo);
      }
      return;
    }

    // Set root to the clicked node to ease exporting data and switching
    // between views.
    root = d;

    kx = (d.y ? width - 40 : width) / (1 - d.y);
    ky = height / d.dx;
    x.domain([d.y, 1]).range([d.y ? 40 : 0, width]);
    y.domain([d.x, d.x + d.dx]);

    t = g.transition()
      .duration(750)
      .attr("transform", function(d) { return "translate(" + x(d.y) + "," + y(d.x) + ")"; });

    t.select("rect")
      .attr("width", d.dy * kx)
      .attr("height", function(d) { return d.dx * ky; });

    t.select("text")
      .attr("transform", transform)
      .style("opacity", function(d) { return d.dx * ky > 12 ? 1 : 0; });

    // Render table with leaf node data.
    updateTableData();
  }

  function transform(d) {
    return "translate(8," + d.dx * ky / 2 + ")";
  }

  function updateTableData() {
    self.leaf_data = {};
    gatherVisibleLeafNodeData(root);
    self.data[cached] = self.toArray(self.leaf_data);
    if (dualView) {
      self.renderTable(self.leaf_data);
    }
  }

  $('#dual-view').unbind('click').bind('click', function() {
    self.renderView(null, self.renderDualView, "#dual-view");
  });
  $('#partition-view').unbind('click').bind('click', function() {
    self.renderView(null, self.renderPartition, "#partition-view");
  });
  $('#table-view').unbind('click').bind('click', function() {
    self.leaf_data = {};
    gatherVisibleLeafNodeData(root);
    self.data[cached] = self.toArray(self.leaf_data);
    self.renderView(self.leaf_data, self.renderTable, "#table-view");
  });
  $('#cmtv').unbind('click').bind('click', function() {
    exportDataSet(root, "cmtv", true);
  });
  $('#tab').unbind('click').bind('click', function() {
    exportDataSet(root, "tab", false);
  });
  $('#gff').unbind('click').bind('click', function() {
    exportDataSet(root, "gff", false);
  });

};

//
// Sort objects by property.
//
LSS.sortable = function(prop, dataType) {

  var self = this;

  data = self.tableData;

  self.sortDir = self.sortDir || "";

  // Check the data and make sure the first object has the requested property.
  if (_.isNull(data) || !_.has(_.first(data), prop)) {
    return;
  }

  self.sortDir === "desc" ? self.sortDir = "asc" : self.sortDir = "desc";

  data = _.sortBy(data, function(d) {
    if (_.isFunction(dataType)) {
      return dataType.call(null, d[prop]);
    }
    return d[prop];
  });

  if (self.sortDir === "asc") {
    data = data.reverse();
  }

  self.renderTable(data);

};

//
// Render table view.
//
LSS.renderTable = function(data) {

  var self = this,
      results = "#table-results",
      template;

  data = self.setData(data);

  // Flatten data before rendering table view.
  data = self.flattenData(data);

  // Set table data for sorting.
  self.tableData = data;

  // Clear existing table.
  $(results).empty();

  template = _.template(
    $("#table-view-template").html(), {
      data: data,
      quorum_id: self.quorum_id
    }
  );

  // Append table view to partition.
  $(results).html(template);

  $('#dual-view').unbind('click').bind('click', function() {
    self.renderView(null, self.renderDualView, "#dual-view");
  });
  $('#partition-view').unbind('click').bind('click', function() {
    self.renderView(null, self.renderPartition, "#partition-view");
  });
  $('#cmtv').unbind('click').bind('click', function() {
    exportDataSet(data, "cmtv", true);
  });
  $('#tab').unbind('click').bind('click', function() {
    exportDataSet(data, "tab", false);
  });
  $('#gff').unbind('click').bind('click', function() {
    exportDataSet(data, "gff", false);
  });

};


//
// Render empty reports.
//
LSS.renderEmptyReports = function() {

  var self = this,
      results = "#results-menu",
      msg;

  if (self.emptyReportDisplayed) {
    return;
  }

  msg = "<div class='ui-state-highlight ui-corner-all empty-report' " +
      "style='padding: 0 .7em;'><span class='ui-icon ui-icon-info' " +
      "style='float: left; margin-right: .3em;'></span>" +
      "%algo% report empty</div>";

  _.each(self.emptyReports, function(r) {
    $(msg.replace(/%algo%/, r.algo)).insertAfter(results);
  });

  // Make the message disappear when clicked.
  $('.empty-report').click(function() {
    $(this).slideUp();
  });

  self.emptyReportDisplayed = true;

};

//
// Render view.
//
LSS.renderView = function(data, view, highlight) {

  var self = this,
      tools = "#tools",
      partition = "#partition-results",
      table = "#table-results";

  // Set default view to dual view if current view is not set.
  self.currentView = self.currentView || self.renderDualView;

  if (highlight) {
    self.highlightView(highlight);
  }

  if (_.isFunction(view)) {
    self.currentView = view;
  }

  // Display tools
  $(tools).show();

  // Empty views
  $(partition).empty();
  $(table).empty();

  if (self.currentView !== self.renderDualView) {
    // Remove height from table view.
    $(table).removeAttr("style");
  }

  self.renderEmptyReports();

  self.currentView.call(self, data);

};

//
// Render interactive menu.
//
LSS.renderMenu = function() {

  var self = this,
      loading = $("#menu-loading");

  loading.empty();

  self.renderView(null, null, "#dual-view");

};

//
// Collects Quorum's results.
//
LSS.collectResults = function(data, algo) {

  var self = this;

  // Set Quorum Job id.
  self.quorum_id = self.quorum_id || _.last(document.URL.split('/'));

  // Copy datasets.
  // If the algorithm wasn't enqueued, prepData returns null.
  self.data[algo] = self.prepData(data, algo);

  // Add valid algo to array.
  if (!_.isNull(self.data[algo])) {
    self.algos.push(algo);
  }

  // Render menu after all algorithms have returned.
  if (_.keys(self.data).length >= self.numSupportedAlgos) {
    self.renderMenu();
  }

};

//
// End LSS
//---------------------------------------------------------------------------//
