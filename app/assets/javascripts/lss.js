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
// Store the visible leaf node data.
//
LSS.leaf_data = LSS.leaf_data || {};

//
// Gather checked algos in the view.
//
LSS.checkedAlgos = function() {

  var self = this,
      algos = [];

  $("input:checkbox:checked", "#algorithms").each(function() {
    algos.push($(this).val().toLowerCase());
  });

  return algos;

};

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
// Flatten a LSS object into an array of objects.
//
// This method is useful for displaying objects in a table view.
//
LSS.flattenData = function(data) {

  var self = this,
      results = [];

  _.each(data, function(v, k) {
    results.push(v);
  });

  return _.flatten(results);

};

//
// Convert LSS object with algo properties to an array of arrays.
//
//
LSS.toArray = function(data) {

  var self = this,
      results = [];

  _.each(data, function(v, k) {
    results.push(v);
  });

  return results;

};

//
// Flag top hit per sequence query by adding property "top_hit": true to each
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
// Removes unwanted properties and adds wanted properties each object.
//
LSS.prepData = function(data, algo) {

  var self = this,
      wanted,
      len = data.length,
      hit,
      i,
      d;

  // Return null if data wasn't enqueued.
  if (data[0].enqueued === false) {
    return null;
  }
  // Return data without result set.
  if (data[0].results === false) {
    return data;
  }

  // Properties to preserve.
  wanted = [
    "id",
    "evalue",
    "bit_score",
    "pct_identity",
    "align_len",
    "hit_def",
    "query",
    "hit_display_id",
    "query_from",
    "query_to",
    "hit_from",
    "hit_to"
  ];

  for (i = 0; i < len; i++) {
    for (d in data[i]) {
      if (!_.include(wanted, d)) {
        delete data[i][d];
      }
    }

    // Bust up hit_display_id into ref and ref_id preserving hit_display_id.
    if (!_.isNull(data[i].hit_display_id)) {
      hit = data[i].hit_display_id.split(":");
      _.extend(data[i], {
        "ref": hit[0],
        "ref_id": hit[1]
      });
    }

    // Extend each object with name and size properties for d3.
    // To avoid d3 node id property collisions, rename hit id
    // to quorum_hit_id.
    //
    // Size will always be 1 since we are displaying each Hsp per hit.
    _.extend(data[i], {
      "algo": algo,
      "name": "Evalue: " + parseFloat(data[i].evalue).toPrecision(3),
      "quorum_hit_id": data[i].id,
      "size": 1
    });
  }

  return self.flagTopHitPerQuery(data);

};

//
// Gather data set per algorithm.
//
LSS.gatherCheckedData = function(algos) {

  var self = this,
      data = [];

  _.each(algos, function(a) {
    data.push(self.data[a]);
  });

  return data;

};

//
// Helper to set cached data.
//
// If cached data is not set, use original.
//
LSS.setCurrentData = function() {

  var self = this,
      data,
      cached = "cached",
      algos = self.checkedAlgos();

  if (_.isNull(self.data[cached]) || _.isUndefined(self.data[cached])) {
    data = self.gatherCheckedData(algos);
  } else {
    data = self.data[cached];
  }

  return data;

}

//
// Helper to set data.
//
// If data is defined, return. Otherwise check for cached data.
//
LSS.setData = function(data) {

  var self = this;

  if (_.isUndefined(data) || _.isNull(data)) {
    data = self.setCurrentData();
  }

  return data;

};

//
// Expand top hit per query sequence.
//
LSS.expandTopHits = function() {

  var self = this,
      algos = self.checkedAlgos(),
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

  self.renderView(data);

};

//
// Expand top hit per reference sequence.
//
LSS.expandTopHitPerRefSeq = function() {

  var self = this,
      algos = self.checkedAlgos(),
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

  self.renderView(ref);

};

//
// Expand top hit per reference.
//
LSS.expandTopHitPerRef = function() {

  var self = this,
      algos = self.checkedAlgos(),
      cached = "cached",
      found,
      tmp = [],
      ref = [];

  // Return if checkedAlgos is empty.
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

  self.renderView(ref);

};

//
// Remove filters by expanding tree using original dataset.
//
LSS.removeFilters = function() {

  var self = this,
      algos = self.checkedAlgos(),
      cached = "cached";

  // Return if checkedAlgos is empty.
  if (_.isEmpty(algos)) {
    return;
  }

  // Destroy any cached data.
  self.data[cached] = null;

  self.renderView(null);

};

//
// Filter dataset on evalue.
//
LSS.evalueFilter = function(value) {

  var self = this,
      algos = self.checkedAlgos(),
      cached = "cached",
      data,
      tmp = [],
      i,
      value = value || "0.0";

  // Return if checkedAlgos is empty.
  if (_.isEmpty(algos)) {
    return;
  }

  // Perform the filter on the cached data if applicable.
  // Otherwise use the original data.
  data = self.setCurrentData();

  for (i = 0; i < algos.length; i++) {
    tmp.push(_.reject(data[i], function(d) {
      if (!_.isUndefined(d.evalue)) {
        return parseFloat(d.evalue) > parseFloat(value);
      }
    }));
  }

  // Cache the result for further filtering.
  self.data[cached] = tmp;

  self.renderView(tmp);

};

//
// Format groups for d3 tree layout.
//
LSS.formatGroups = function(data) {

  var self = this,
      groups = {};

  // Group by hit_display_id.
  groups = _.groupBy(data, 'hit_display_id');

  // Group each sub group by query.
  _.each(groups, function(v, k) {
    groups[k] = _.groupBy(v, 'query');
  });

  return groups;

};

//
// Format HSPs.
//
LSS.formatHsps = function(data) {

  var self = this,
      hsps = [];

  _.each(data, function(d) {
    hsps.push({
      "name": "q:" + d.query_from + "-" + d.query_to + "::h:" + d.hit_from + "-" + d.hit_to,
      "children": [d]
    });
  });

  return hsps;

};

//
// Format queries.
//
LSS.formatQueries = function(data) {

  var self = this,
      queries = [];

  _.each(data, function(v, k) {
    queries.push({
      "name": k,
      "children": self.formatHsps(v)
    });
  });

  return queries;

};

//
// Format single data set.
//
LSS.formatData = function(data, algo) {

  var self = this,
      groups = {},
      formatted = {},
      hit,
      found;

  formatted = {
    "name": algo,
    "children": []
  };

  if (_.isEmpty(data) || data[0].results === false) {
    return formatted;
  }

  groups = self.formatGroups(data);

  keys = _.keys(groups);

  _.each(keys, function(key) {
    hit = key.split(":");

    found = _.find(formatted.children, function(c) { return c.name === hit[0]; });
    if (_.isUndefined(found)) {
      formatted.children.push({
        "name": hit[0],
        "children": [{
          "name": hit[1],
          "children": self.formatQueries(groups[key])
        }]
      });
    } else {
      _.each(formatted.children, function(v, k) {
        if (v.name === hit[0]) {
          v.children.push({
            "name": hit[1],
            "children": self.formatQueries(groups[key])
          });
        }
      });
    }
  });

  return formatted;

};

//
// Format results into nested objects reday for d3.js tree views.
//
LSS.formatResults = function(data, algos) {

  var self = this,
      formatted,
      i;

  // Combine if multiple data sets are selected.
  if (data.length > 1) {
    formatted = {
      "name": self.quorum_id,
      "children": []
    };

    for (i = 0; i < data.length; i++) {
      formatted.children.push(self.formatData(data[i], algos[i]));
    }
  } else {
    formatted = self.formatData(data[0], algos[0]);
  }

  return formatted;

};

//
// Renders an interactive d3 partition view.
//
LSS.renderPartition = function(data) {

  var self = this,
      algos = self.checkedAlgos(),
      cached = "cached",
      results = "#partition-results",
      tools = "#tools",
      id = self.quorum_id,
      margin = { top: 20, right: 20, bottom: 20, left: 60 },
      width = $(results).width() - margin.right - margin.left,
      height = (window.innerHeight * 0.6) - margin.top - margin.bottom,
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

  data = self.setData(data);

  // Clear existing partition.
  $(results).empty();

  // Display tools
  $(tools).show();

  // Stuff data into a nested JSON.
  formatted = self.formatResults(data, algos);

  // Set root to formatted for partition view.
  root = formatted;

  // Clear leaf_data
  self.leaf_data = {};

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

  // Render the table view along with the partition.
  self.renderTable(data);

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

    // Clear leaf data on each call.
    self.leaf_data = {};

    // Render table with leaf node data.
    updateTableData();
   }

  function transform(d) {
    return "translate(8," + d.dx * ky / 2 + ")";
  }

  function updateTableData() {
    gatherVisibleLeafNodeData(root);
    self.data[cached] = self.toArray(self.leaf_data);
    self.renderTable(self.leaf_data);
  }

  // Export tree event handlers.
  // Hack to ensure only one event handler is bound.
  // TODO: Make this purdy.
  $('#cmtv').unbind('click').bind('click', function() {
    exportDataSet(root, "cmtv", true);
  });
  $('#tab').unbind('click').bind('click', function() {
    exportDataSet(root, "tab", false);
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

  template = _.template(
    $("#table-view").html(), {
      data: data,
      quorum_id: self.quorum_id
    }
  );

  // Clear existing table.
  $(results).empty();

  // Append table view to partition.
  $(results).html(template)
    .css('height', (window.innerHeight * 0.4));

};


//
// Render view.
//
LSS.renderView = function(data, view, highlight) {

  var self = this,
      args;

  // Set default view to partition if current view is not set.
  self.currentView = self.currentView || self.renderPartition;

  if (highlight) {
    self.highlightView(highlight);
  }

  if (_.isFunction(view)) {
    self.currentView = view;
  }

  self.currentView.call(self, data);

};

//
// Render interactive menu.
//
LSS.renderMenu = function(algo) {

  var self = this,
      view = $("#view"),
      loading = $("#menu-loading"),
      algorithms = $("#algorithms");

  if (_.isUndefined(algo) || _.isNull(algo) || _.isEmpty(algo)) {
    return;
  }

  algo = algo.toLowerCase(),
  loading.empty();

  algorithms.append(
    "<input type='checkbox' id='" + algo + "' value='" + algo + "'/>" +
    "<label for='" + algo + "'>" + algo + "</label>"
  );

  // Format the checkboxes
  $(algorithms).buttonset();

  // Add the click event handler
  $("input:checkbox", algorithms).click(function() {
    if ($("input:checkbox:checked", algorithms).length > 0) {
      view.show();
    } else {
      view.hide();
    }
  });

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

  // Render menu
  if (!_.isNull(self.data[algo])) {
    self.renderMenu(algo);
  }

};

//
// End LSS
//---------------------------------------------------------------------------//
