//
// LIS Sequence Search
//
// d3 interactive tree harvested from
// http://mbostock.github.com/d3/talk/20111018/tree.html
//
// Author: Ken Seal
//
var LSS = LSS || {};

//
// Cache the datasets returned from Quorum per algorithm.
//
LSS.data = LSS.data || {};

//
// Remove unwanted properties.
//
LSS.trimData = function(data) {

  var self = this,
      wanted,
      len = data.length,
      i, d;

  // Return data without result set.
  if (data[0].results === false) {
    return data;
  }

  // Properties to preserve.
  wanted = [
    "id",
    "evalue",
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
  }

  return data;

};

//
// Expand top hit per query sequence.
//
LSS.expandTopHits = function(algo) {

  var self = this,
      algo = algo.toLowerCase(),
      cached = algo + "-cached",
      data,
      results = "#" + algo + "-results";

  $(results).empty();

  data = _.reject(self.data[algo], function(d) {
    return _.isUndefined(d.top_hit);
  });

  // Cache the result for further filtering.
  self.data[cached] = data;

  self.renderTree(data, algo);

};

//
// Expand top hit per reference sequence.
//
LSS.expandTopHitPerRefSeq = function(algo) {

  var self = this,
      algo = algo.toLowerCase(),
      cached = algo + "-cached",
      results = "#" + algo + "-results",
      found,
      ref = [];

  $(results).empty();

  _.each(self.data[algo], function(d) {
    found = _.find(ref, function(r) {
      return r.hit_display_id === d.hit_display_id && r.query === d.query;
    });
    if (!found) {
      ref.push(d);
    }
  });

  // Cache the result for further filtering.
  self.data[cached] = ref;

  self.renderTree(ref, algo);

};

//
// Expand top hit per reference.
//
LSS.expandTopHitPerRef = function(algo) {

  var self = this,
      algo = algo.toLowerCase(),
      cached = algo + "-cached",
      results = "#" + algo + "-results",
      found,
      ref = [];

  $(results).empty();

  // Add ref property to each object.
  _.each(self.data[algo], function(d) {
    hit = d.hit_display_id.split(":");
    _.extend(d, { "ref": hit[0] });
  });

  _.each(self.data[algo], function(d) {
    found = _.find(ref, function(r) {
      return r.ref === d.ref && r.query === d.query;
    });
    if (!found) {
      ref.push(d);
    }
  });

  // Cache the result for further filtering.
  self.data[cached] = ref;

  self.renderTree(ref, algo);

};

//
// Expand tree using original dataset.
//
LSS.expandTree = function(algo) {

  var self = this,
      algo = algo.toLowerCase(),
      cached = algo + "-cached",
      results = "#search-results";

  $(results).empty();

  // Destroy any cached data.
  self.data[cached] = null;

  self.renderTree(self.data[algo], algo);

};

//
// Filter dataset on evalue.
//
LSS.evalueFilter = function(value, algo) {

  var self = this,
      algo = algo.toLowerCase(),
      cached = algo + "-cached",
      data,
      value = value || "0.0",
      results = "#search-results";

  // Perform the filter on the cached data if applicable.
  // Otherwise use the original dataset.
  data = self.data[cached] || self.data[algo];

  data = _.reject(data, function(d) {
    return parseFloat(d.evalue) > parseFloat(value);
  });

  $(results).empty();

  self.renderTree(data, algo);
};

//
// Flag top hit per sequence query by adding property
// "top_hit": true to each object.
//
LSS.flagTopHitPerQuery = function(data) {

  var self = this,
      query;

  _.each(data, function(d) {
    if (query !== d.query) {
      _.extend(d, { "top_hit": true });
      query = d.query;
    }
  });

  return data;

};

//
// Format groups for d3 tree layout.
//
LSS.formatGroups = function(data) {

  var self = this,
      groups = {};

  data = self.flagTopHitPerQuery(data);

  // Group by hit_display_id.
  groups = _.groupBy(data, 'hit_display_id');

  // Extend each object with name and size properties for d3.
  // To avoid d3 tree node id property collisions, rename hit id
  // to quorum_id.
  _.each(groups, function(v, k) {
    _.each(v, function(d) {
      _.extend(d, { "name": "Evalue: " + d.evalue, "size": parseFloat(d.evalue), "quorum_id": d.id });
    });
  });

  // Group each sub group by query.
  _.each(groups, function(v, k) {
    groups[k] = _.groupBy(v, 'query');
  });

  return groups;

};

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
// Format queries for d3 tree layout.
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
// Format data into nested JSON.
//
LSS.formatResults = function(data, algo) {

  if (_.isEmpty(data) || data[0].results === false) {
    return {};
  }

  var self = this,
      groups = {},
      formatted = {};

  formatted = {
    "name": algo,
    "children": []
  };

  groups = self.formatGroups(data);

  keys = _.keys(groups);

  _.each(keys, function(key) {
    var hit = key.split(":");

    var found = _.find(formatted.children, function(c) { return c.name === hit[0]; });
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
// Renders an interactive d3 tree.
//
LSS.renderTree = function(data, algo) {

  var self = this,
      algo = algo.toLowerCase(),
      data = data || self.data[algo],
      id = self.quorum_id,
      margin = { top: 20, right: 120, bottom: 20, left: 120 },
      width = 1280 - margin.right - margin.left,
      height = 1200 - margin.top - margin.bottom,
      i = 0,
      k,
      duration = 500,
      root,
      results = "#search-results",
      tools = "#tools";

  // Empty results before calling d3.
  $(results).empty();

  var tree = d3.layout.tree()
    .size([height, width]);

  var diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.y, d.x]; });

  var vis = d3.select(results).append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  formatted = self.formatResults(data, algo);

  if (_.isEmpty(formatted)) {
    $(tools).hide();
    $(results).html("<h4>Your search returned 0 hits.</h4>");
    return;
  }

  $(tools).show();

  root = formatted;
  root.x0 = height / 2;
  root.y0 = 0;

  // Toggle children.
  function toggle(d) {
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }
  }

  // Toggle all.
  function toggleAll(d) {
    if (d.children) {
      d.children.forEach(toggleAll);
      toggle(d);
    }
  }

  // Update the tree.
  function update(source) {

    // Compute the new tree layout.
    var nodes = tree.nodes(root).reverse();

    // Normalize for fixed-depth.
    nodes.forEach(function(d) { d.y = d.depth * 180; });

    // Update the nodes…
    var node = vis.selectAll("g.node")
      .data(nodes, function(d) { return d.id || (d.id = ++i); });

    // Enter any new nodes at the parent's previous position.
    var nodeEnter = node.enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
      .on("click", function(d) { toggle(d); update(d); });

    nodeEnter.append("circle")
      .attr("r", 1e-6)
      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

    nodeEnter.append("text")
      .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
      .attr("dy", ".35em")
      .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
      .text(function(d) { return d.name; })
      .style("fill-opacity", 1e-6)
      .attr("onclick", function(d) {
        return (d.children || d._children) ? "" : "QUORUM.viewDetailedReport(" + id + "," + d.quorum_id + ",'" + d.query + "','" + algo + "')";
      })
      .attr("class", function(d) {
        var r;
        if (d.children || d._children) {
          r = "";
        } else {
          if (d.top_hit) {
            r = "top-hit pointer";
          } else {
            r = "pointer";
          }
        }
        return r;
      });

    // Transition nodes to their new position.
    var nodeUpdate = node.transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

    nodeUpdate.select("circle")
      .attr("r", 4.5)
      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

    nodeUpdate.select("text")
      .style("fill-opacity", 1);

    // Transition exiting nodes to the parent's new position.
    var nodeExit = node.exit().transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
      .remove();

    nodeExit.select("circle")
      .attr("r", 1e-6);

    nodeExit.select("text")
      .style("fill-opacity", 1e-6);

    // Update the links…
    var link = vis.selectAll("path.link")
      .data(tree.links(nodes), function(d) { return d.target.id; });

    // Enter any new links at the parent's previous position.
    link.enter().insert("path", "g")
      .attr("class", "link")
      .attr("d", function(d) {
        var o = { x: source.x0, y: source.y0 };
        return diagonal({ source: o, target: o });
      });

    // Transition links to their new position.
    link.transition()
      .duration(duration)
      .attr("d", diagonal);

    // Transition exiting nodes to the parent's new position.
    link.exit().transition()
      .duration(duration)
      .attr("d", function(d) {
        var o = { x: source.x, y: source.y };
        return diagonal({ source: o, target: o });
      })
      .remove();

    // Stash the old positions for transition.
    nodes.forEach(function(d) {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }

  update(root);
};

//
// Render interactive menu.
//
LSS.renderMenu = function(algo) {

  var self = this,
      algo = algo.toLowerCase(),
      view = $("#view"),
      loading = $("#menu-loading"),
      algorithms = $("#algorithms");

  loading.empty();

  algorithms.append(
    "<input type='checkbox' id='" + algo + "' value='" + algo + "'/>" +
    "<label for='" + algo + "'>" + algo + "</label><br />"
  );

  // Format the checkboxes
  $("input:checkbox", algorithms).button();

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
LSS.collectResults = function(id, data, algo) {

  var self = this;

  self.quorum_id = self.quorum_id || id;

  // Copy trimmed datasets.
  self.data[algo] = self.trimData(data);

  // Render menu
  self.renderMenu(algo);

};

//
// jQuery event handlers
//
$(function() {
  $("#view").hide();
  $("#tools").hide();
  $("input:checkbox, button", "#results-menu").button();

  // View
  $("#view").click(function() {
    var algorithms = $("#algorithms input:checkbox:checked");

    LSS.renderTree(null, algorithms.val());
  });

  // Expand Tree
  $("#expand-tree").click(function() {
    var algos = [];
    $("input:checkbox:checked", "#algorithms").each(function() {
      algos.push($(this).val());
    });

    if (!_.isEmpty(algos)) {
      LSS.expandTree(algos.join("-"));
    }
  });

  // Top Hits
  $("#top-hits").click(function() {
    var algos = [];
    $("input:checkbox:checked", "#algorithms").each(function() {
      algos.push($(this).val());
    });

    if (!_.isEmpty(algos)) {
      LSS.expandTopHits(algos.join("-"));
    }
  });

  // Top Hits Per Reference Sequence
  $("#top-hits-per-ref-seq").click(function() {
    var algos = [];
    $("input:checkbox:checked", "#algorithms").each(function() {
      algos.push($(this).val());
    });

    if (!_.isEmpty(algos)) {
      LSS.expandTopHitPerRefSeq(algos.join("-"));
    }
  });

  // Top Hits Per Reference
  $("#top-hits-per-ref").click(function() {
    var algos = [];
    $("input:checkbox:checked", "#algorithms").each(function() {
      algos.push($(this).val());
    });

    if (!_.isEmpty(algos)) {
      LSS.expandTopHitPerRef(algos.join("-"));
    }
  });

  // Evalue Filter
  $("#filter-evalue").click(function() {
    var val = $("#evalue").val();
    var algos = [];
    $("input:checkbox:checked", "#algorithms").each(function() {
      algos.push($(this).val());
    });

    if (!_.isEmpty(algos)) {
      LSS.evalueFilter(val, algos.join("-"));
    }
  });
});

