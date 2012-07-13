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
// Third party URLs used to view result sets.
//
LSS.exportUrls = {
  cmtv: "http://velarde.ncgr.org:7070/isys/launch?svc=org.ncgr.cmtv.isys." +
    "CompMapViewerService%40--style%40http://velarde.ncgr.org:7070/isys/bin/" +
    "Components/cmtv/conf/cmtv_combined_map_style.xml%40--combined_display%40" +
    document.URL + "/get_quorum_search_results.gff%3F"
};

//
// Cache the datasets returned from Quorum per algorithm.
//
LSS.data = LSS.data || {};

//
// Remove unwanted properties and add algo property to each object.
//
LSS.trimData = function(data, algo) {

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
    _.extend(data[i], { "algo": algo });
  }

  return data;

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
// Expand top hit per query sequence.
//
LSS.expandTopHits = function(algos) {

  var self = this,
      algos = _.map(algos, function(a) { return a.toLowerCase(); }),
      cached = algos.join("-") + "-cached",
      data = [],
      results = "#search-results";

  $(results).empty();

  _.each(algos, function(a) {
    data.push(_.reject(self.data[a], function(d) {
      return _.isUndefined(d.top_hit);
    }));
  });

  // Cache the result for further filtering.
  self.data[cached] = data;

  self.renderTree(data, algos);

};

//
// Expand top hit per reference sequence.
//
LSS.expandTopHitPerRefSeq = function(algos) {

  var self = this,
      algos = _.map(algos, function(a) { return a.toLowerCase(); }),
      cached = algos.join("-") + "-cached",
      results = "#search-results",
      found,
      tmp = [],
      ref = [];

  $(results).empty();

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

  self.renderTree(ref, algos);

};

//
// Expand top hit per reference.
//
LSS.expandTopHitPerRef = function(algos) {

  var self = this,
      algos = _.map(algos, function(a) { return a.toLowerCase(); }),
      cached = algos.join("-") + "-cached",
      results = "#search-results",
      found,
      tmp = [],
      ref = [];

  $(results).empty();

  _.each(algos, function(a) {
    // Add ref property to each object.
    _.each(self.data[a], function(d) {
      if (!_.isNull(d.hit_display_id)) {
        hit = d.hit_display_id.split(":");
        _.extend(d, { "ref": hit[0] });
      }
    });

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

  self.renderTree(ref, algos);

};

//
// Expand tree using original dataset.
//
LSS.expandTree = function(algos) {

  var self = this,
      algos = _.map(algos, function(a) { return a.toLowerCase(); }),
      cached = algos.join("-") + "-cached",
      results = "#search-results";

  $(results).empty();

  // Destroy any cached data.
  self.data[cached] = null;

  self.renderTree(null, algos);

};

//
// Filter dataset on evalue.
//
LSS.evalueFilter = function(value, algos) {

  var self = this,
      algos = _.map(algos, function(a) { return a.toLowerCase(); }),
      cached = algos.join("-") + "-cached",
      data,
      tmp = [],
      i,
      value = value || "0.0",
      results = "#search-results";

  // Perform the filter on the cached data if applicable.
  // Otherwise use the original data.
  if (_.isNull(self.data[cached]) || _.isUndefined(self.data[cached])) {
    data = self.gatherCheckedData(algos);
  } else {
    data = self.data[cached];
  }

  for (i = 0; i < algos.length; i++) {
    tmp.push(_.reject(data[i], function(d) {
      if (!_.isUndefined(d.evalue)) {
        return parseFloat(d.evalue) > parseFloat(value);
      }
    }));
  }

  $(results).empty();

  self.renderTree(tmp, algos);
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
  // to quorum_hit_id.
  _.each(groups, function(v, k) {
    _.each(v, function(d) {
      _.extend(d, {
        "name": "Evalue: " + parseFloat(d.evalue).toPrecision(3),
        "size": parseFloat(d.evalue).toPrecision(3),
        "quorum_hit_id": d.id
      });
    });
  });

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
      formatted = {};

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
// Format results into nested JSON.
//
LSS.formatResults = function(data, algos) {

  var self = this,
      formatted,
      i;

  // If multiple data sets are selected, combine into a single tree.
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
// Renders an interactive d3 tree.
//
LSS.renderTree = function(data, algos) {

  var self = this,
      algos = _.map(algos, function(a) { return a.toLowerCase(); }),
      data,
      id = self.quorum_id,
      margin = { top: 20, right: 0, bottom: 20, left: 45 },
      width = 1280 - margin.right - margin.left, // default width
      height = 800 - margin.top - margin.bottom, // default height
      i = 0,
      k,
      duration = 500,
      results = "#search-results",
      tools = "#tools",
      root,
      tree,
      diagonal,
      vis,
      leaf_size = 12, // pixels per leaf node
      total_leaf_size = 0,
      leaf_data;

  // Empty results before calling d3.
  $(results).empty();

  // Gather data sets if data is null.
  if (_.isNull(data)) {
    data = self.gatherCheckedData(algos);
  }

  // Stuff data into a nested JSON.
  formatted = self.formatResults(data, algos);

  // Recursively calculate the total number of leaves in the tree.
  function totalLeafSize(d) {
    if (d.children) {
      d.children.forEach(totalLeafSize);
    } else {
      total_leaf_size += leaf_size;
    }
  }

  totalLeafSize(formatted);

  // If the calculated total_leaf_size is > than the default height,
  // set height to the total_leaf_size to ensure each leaf node has
  // approximately 12x12 px of space.
  if (total_leaf_size > height) {
    height = total_leaf_size - margin.top - margin.bottom;
  }

  // Display tools
  $(tools).show();

  root = formatted;
  root.x0 = height / 2;
  root.y0 = 0;

  tree = d3.layout.tree()
    .size([height, width]);

  diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.y, d.x]; });

  vis = d3.select(results).append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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

  // Recursively toggle all nodes deeper than level 1.
  // Call this function if you choose to collapse the tree.
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
      .data(nodes, function(d) { return d.id || (d.id = i += 1); });

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
        var h;
        if (d.children || d._children) {
          h = "";
        } else {
          h = "QUORUM.viewDetailedReport(" +
            id + "," + d.quorum_hit_id + ",'" + d.query + "','" + d.algo +
          "')";
        }
        return h;
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

  // Recursively gather visible node data.
  function gatherVisibleLeafNodeData(d) {
    if (d.children) {
      d.children.forEach(gatherVisibleLeafNodeData);
    } else {
      if (_.isArray(leaf_data[d.algo])) {
        leaf_data[d.algo].push(d.id);
      } else {
        leaf_data[d.algo] = [];
        leaf_data[d.algo].push(d.id);
      }
    }
  }

  // Export data set
  function exportDataSet() {
    var cmtv = self.exportUrls.cmtv;
    leaf_data = {};

    gatherVisibleLeafNodeData(root);

    cmtv += "algo%3D" + _.keys(leaf_data).join(",");
    _.each(leaf_data, function(v, k) {
      cmtv += "%26" + k + "_id%3D" + v.join(",");
    });

    window.open(cmtv);
  }

  // View in cmtv event handler.
  // Hack to ensure only one event handler is bound.
  // TODO: Make this purdy.
  $('#cmtv').unbind('click').bind('click', function() {
    exportDataSet()
  });
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
  self.data[algo] = self.trimData(data, algo);

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

  var checkedAlgos = function() {
    var algos = [];
    $("input:checkbox:checked", "#algorithms").each(function() {
      algos.push($(this).val());
    });

    return algos;
  };

  // View
  $("#view").click(function() {
    var algos = checkedAlgos();

    if (!_.isEmpty(algos)) {
      LSS.renderTree(null, algos);
    }
  });

  // Expand Tree
  $("#expand-tree").click(function() {
    var algos = checkedAlgos();

    if (!_.isEmpty(algos)) {
      LSS.expandTree(algos);
    }
  });

  // Top Hits
  $("#top-hits").click(function() {
    var algos = checkedAlgos();

    if (!_.isEmpty(algos)) {
      LSS.expandTopHits(algos);
    }
  });

  // Top Hits Per Reference Sequence
  $("#top-hits-per-ref-seq").click(function() {
    var algos = checkedAlgos();

    if (!_.isEmpty(algos)) {
      LSS.expandTopHitPerRefSeq(algos);
    }
  });

  // Top Hits Per Reference
  $("#top-hits-per-ref").click(function() {
    var algos = checkedAlgos();

    if (!_.isEmpty(algos)) {
      LSS.expandTopHitPerRef(algos);
    }
  });

  // Evalue Filter
  $("#filter-evalue").click(function() {
    var val = $("#evalue").val();
    var algos = checkedAlgos();

    if (!_.isEmpty(algos)) {
      LSS.evalueFilter(val, algos);
    }
  });
});

