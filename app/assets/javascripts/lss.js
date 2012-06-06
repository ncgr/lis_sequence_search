var LSS = LSS || {};

LSS.formatGroups = function(data) {

  var groups = {};

  groups = _.groupBy(data, 'hit_display_id');

  _.each(groups, function(v, k) {
    _.each(v, function(d) {
      _.extend(d, { "name": d.evalue, "size": parseFloat(d.evalue, 10) });
    });
  });

  return groups;

};

LSS.formatResults = function(data, algo) {

  if (data[0].results === false) {
    return {};
  }

  var groups = {},
      formatted = {
        "name": algo,
        "children": []
      };

  groups = LSS.formatGroups(data);

  keys = _.keys(groups);

  _.each(keys, function(key) {
    var hit = key.split(":");

    var found = _.find(formatted.children, function(c) { return c.name === hit[0]; });
    if (_.isUndefined(found)) {
      formatted.children.push({
        "name": hit[0],
        "children": [{
          "name": hit[1],
          "children": groups[key]
        }]
      });
    } else {
      _.each(formatted.children, function(v, k) {
        if (v.name === hit[0]) {
          v.children.push({
            "name": hit[1],
            "children": groups[key]
          });
        }
      });
    }
  });

  return formatted;

};

LSS.renderTree = function(data, algo, id) {

  var margin = { top: 20, right: 120, bottom: 20, left: 120 },
      width = 1280 - margin.right - margin.left,
      height = 800 - margin.top - margin.bottom,
      i = 0,
      duration = 500,
      root,
      results = "#" + algo.toLowerCase() + "-results";

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

  formatted = LSS.formatResults(data, algo);

  if (_.isEmpty(formatted)) {
    return $(results).html(
      "Your search returned 0 hits."
    );
  }

  root = formatted;
  root.x0 = height / 2;
  root.y0 = 0;

  function collapse(d) {
    if (d.children) {
      d._children = d.children;
      d._children.forEach(collapse);
      d.children = null;
    }
  }

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
      .on("click", click);

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
        return (d.children || d._children) ? "" : "QUORUM.viewDetailedReport(" + id + "," + d.id + ",'" + d.query + "','" + algo + "')";
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

  // Toggle children on click.
  function click(d) {
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }
    update(d);
  }

  root.children.forEach(collapse);
  update(root);
};

LSS.pollResults = function(id, interval, algos) {

  var interval = interval || 5000,
      algos = algos || QUORUM.algorithms,
      times = 4;

  _.each(algos, function(a) {
    $.getJSON(
      '/quorum/jobs/' + id + '/get_quorum_search_results.json?algo=' + a,
      function(data) {
        if (data.length === 0) {
          setTimeout(function() {
            LSS.pollResults(id, interval, [a]);
          }, interval);
        } else {
          LSS.renderTree(data, a, id);
        }
      }
      );
  });

};

