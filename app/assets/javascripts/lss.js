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
// URLs used to view result sets.
//
LSS.exportUrls = {
  cmtv: "http://velarde.ncgr.org:7070/isys/launch?svc=org.ncgr.cmtv.isys." +
    "CompMapViewerService%40--style%40http://velarde.ncgr.org:7070/isys/bin/" +
    "Components/cmtv/conf/cmtv_combined_map_style.xml%40--combined_display%40" +
    document.URL + "/get_quorum_search_results.gff%3F",

  tab: document.URL + "/get_quorum_search_results.txt?"
};

//
// GBrowse URLs
//
LSS.gbrowseUrls = {
  mt_jcvi: "http://www.jcvi.org/cgi-bin/gb2/gbrowse/mtruncatula/?" +
    "ref=%ref%;start=%start%;stop=%stop%;width=1024;version=100;i" +
    "cache=on;drag_and_drop=on;show_tooltips=on;grid=on;label=Gene-" +
    "Transcripts_all-Transcripts_Bud-Transcripts_Blade-Transcripts_Root-" +
    "Transcripts_Flower-Transcripts_Seed-Transcripts_mtg-Gene_Models-" +
    "mt_fgenesh-genemarkHMM-genscan-fgenesh-TC_poplar-TC_maize-TC_" +
    "arabidopsis-TC_Lotus-TC_soybean-TC_cotton-TC_medicago-TC_rice-" +
    "TC_sorghum;add=%ref%+LIS+LIS_Query_%query%+%hit_from%..%hit_to%",

  mt_lis: "http://medtr.comparative-legumes.org/gb2/gbrowse/3.5.1/?" +
    "ref=%ref%;start=%start%;stop=%stop%;width=1024;version=100;flip=0;" +
    "grid=1;add=%ref%+LIS+LIS_Query_%query%+%hit_from%..%hit_to%",

  mt_hapmap: "http://www.medicagohapmap.org/cgi-bin/gbrowse/mthapmap/?" +
    "q=%ref%:%start%..%stop%;t=Genes+Transcript+ReadingFrame+Translation+" +
    "SNP+SNP_HM005+CovU_HM005+SNP_HM006+CovU_HM006+SNP_HM029+CovU_HM029;c=1;" +
    "add=%ref%+LIS+LIS_Query_%query%+%hit_from%..%hit_to%",

  mt_affy: "http://mtgea.noble.org/v2/probeset.php?id=",

  gm_soybase: "http://soybase.org/gb2/gbrowse/gmax1.01/?" +
    "ref=%ref%;start=%start%;stop=%stop%;version=100;cache=on;" +
    "drag_and_drop=on;show_tooltips=on;grid=on;add=%ref%+LIS+" +
    "LIS_Query_%query%+%hit_from%..%hit_to%",

  lj_kazusa: "http://gsv.kazusa.or.jp/cgi-bin/gbrowse/lotus/?" +
    "ref=%ref%;start=%start%;stop=%stop%;width=1024;version=100;" +
    "label=contig-phase3-phase1%%2C2-annotation-GMhmm-GenScan-blastn-tigrgi-" +
    "blastx-marker;grid=on;add=%ref%+LIS+LIS_Query_%query%+" +
    "%hit_from%..%hit_to%",

  cc_lis: "http://cajca.comparative-legumes.org/gb2/gbrowse/1.0/?" +
    "ref=%ref%;start=%start%;stop=%stop%;width=1024;version=100;flip=0;" +
    "grid=1;add=%ref%+LIS+LIS_Query_%query%+%hit_from%..%hit_to%"
};

//
// Replace GBrowse URL placeholders with correct values.
//
LSS.formatGbrowseUrl = function(data, url, type) {

  var self = this,
      hit,
      chr,
      area = 50000,
      hit_from,
      hit_to;

  hit = _.last(data.hit_display_id.split(":"));
  hit = hit.substring(hit.lastIndexOf('_') + 1, hit.length);

  // Format hit for special cases.
  switch(type) {
    case "soybase":
      if (hit.length < 4) {
        chr = hit.slice(2);
        hit = "chr0" + chr;
      }
      break;
    case "jcvi":
      if (hit.length < 5) {
        chr = hit.slice(3);
        hit = "chr" + chr;
      }
      break;
    case "medtr-lis":
      if (hit.search(/chr[0-9]/) !== -1) {
        hit = "Mt" + hit.substring(3);
      }
      break;
    case "hapmap":
      hit = hit.replace(/0/g, '');
      break;
    case "cajca-lis":
      if (hit.search(/CcLG[0-9]+/) !== -1) {
        hit = "Cc" + hit.substring(4);
      }
      break;
    default:
      break;
  }

  // Make sure start < stop.
  function format_start_stop(start, stop) {
    hit_from = start;
    hit_to = stop;

    if (start > stop) {
      hit_from = stop;
      hit_to = start;
    }

    return;
  }

  format_start_stop(data.hit_from, data.hit_to);

  // Expand the GBrowse viewing interval while retaining the orientation.
  if (hit_from <= hit_to) {
    hit_from = hit_from > area ? (hit_from - area) : 1;
    hit_to = hit_to + area;
  } else {
    hit_from = hit_from + area;
    hit_to = hit_to > area ? (hit_to - area) : 1;
  }

  url = url.replace(/%ref%/g, hit);
  url = url.replace(/%start%/, hit_from);
  url = url.replace(/%stop%/, hit_to);
  url = url.replace(/%query%/, data.query);
  url = url.replace(/%hit_from%/, data.hit_from);
  url = url.replace(/%hit_to%/, data.hit_to);

  return url;

}

//
// Add Gm properties
//
LSS.addGm = function(data) {

  var self = this,
      url = self.gbrowseUrls.gm_soybase,
      urls = [];

  urls.push({
    "name": "Glycine max - Soybase",
    "url": self.formatGbrowseUrl(data, url, "soybase")
  });

  return urls;

};

//
// Add Mt properties
//
LSS.addMt = function(data) {

  var self = this,
      urls = [];

  urls.push({
    "name": "Medicago truncatula - JCVI",
    "url": self.formatGbrowseUrl(data, self.gbrowseUrls.mt_jcvi, "jcvi")
  });

  urls.push({
    "name": "Medicago truncatula - Hapmap",
    "url": self.formatGbrowseUrl(data, self.gbrowseUrls.mt_hapmap, "hapmap")
  });

  urls.push({
    "name": "Medicago truncatula - LIS",
    "url": self.formatGbrowseUrl(data, self.gbrowseUrls.mt_lis, "medtr-lis")
  });

  return urls;

};

//
// Add Lj properties
//
LSS.addLj = function(data) {

  var self = this,
      url = self.gbrowseUrls.lj_kazusa,
      urls = [];

  urls.push({
    "name": "Lotus japonicus - Kazusa",
    "url": self.formatGbrowseUrl(data, url)
  });

  return urls;

};

//
// Add Cc properties
//
LSS.addCc = function(data) {

  var self = this,
      url = self.gbrowseUrls.cc_lis,
      urls = [];

  urls.push({
    "name": "Cajanus cajan - LIS",
    "url": self.formatGbrowseUrl(data, url, "cajca-lis")
  });

  return urls;

};

//
// Add linkouts to GBrowse instances.
//
LSS.addGbrowseLinkOuts = function(data) {

  var self = this,
      hit,
      links = [];

  hit = _.first(data.hit_display_id.split(":"));

  if (hit.search(/gm_genome_rel_1_01/) === 0) {
    links.push(self.addGm(data));
  }
  if (hit.search(/mt_genome_3_5_1/) === 0) {
    links.push(self.addMt(data));
  }
  if (hit.search(/lj_genome_2_5/) === 0) {
    links.push(self.addLj(data));
  }
  if (hit.search(/cc_genome_1_0/) === 0) {
    links.push(self.addCc(data));
  }

  return links;

};

//
// Format link outs.
//
LSS.formatLinkouts = function(data) {

  var self = this,
      links = [];

  // Add the GBrowse linkouts to each hsp.
  _.each(self.addGbrowseLinkOuts(data), function(link) {
    _.each(link, function(l) {
      links.push(l);
    });
  });

  return links;

};

//
// Remove unwanted properties and add algo to each object.
//
LSS.trimData = function(data, algo) {

  var self = this,
      wanted,
      len = data.length,
      i, d;

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
// Remove filters by expanding tree using original dataset.
//
LSS.removeFilters = function(algos) {

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

  // Extend each object with name a property for d3.
  // To avoid d3 tree node id property collisions, rename hit id
  // to quorum_hit_id.
  _.each(groups, function(v, k) {
    _.each(v, function(d) {
      _.extend(d, {
        "name": "Evalue: " + parseFloat(d.evalue).toPrecision(3),
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
      results = "#search-results",
      tools = "#tools",
      id = self.quorum_id,
      margin = { top: 20, right: 20, bottom: 20, left: 60 },
      width = $(results).width() - margin.right - margin.left,
      height = 800 - margin.top - margin.bottom,
      node_distance = 240,
      i = 0,
      k,
      duration = 500,
      root,
      tree,
      diagonal,
      vis,
      leaf_size = 12, // pixels per leaf node
      total_leaf_size = 0,
      leaf_data;

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
  //
  // The width is adjusted in the update() below.
  // See calculated_width.
  if (total_leaf_size > height) {
    height = total_leaf_size - margin.top - margin.bottom;
  }

  // Empty results before calling d3.
  $(results).empty();

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

    // Calculate the max depth of the tree.
    var max_depth = d3.max(nodes, function(d) { return d.depth; });

    // Calculate width using normalized node_distance.
    var calculated_width = (max_depth * node_distance) + margin.right +
      margin.left;

    // Recalculate node_distance if it's greater than the width of the tree.
    if (calculated_width > width) {
      node_distance = (width / max_depth) - margin.right;
    }

    // Normalize for fixed-depth.
    nodes.forEach(function(d) { d.y = d.depth * node_distance; });

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
      .on("click", function(d) {
        if (d.quorum_hit_id) {
          return QUORUM.viewDetailedReport(id, d.quorum_hit_id, d.query, d.algo);
        }
        return;
      })
      .attr("class", function(d) {
        var r = "";
        if (d.quorum_hit_id) {
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
  function exportDataSet(type, encode) {
    var base = self.exportUrls[type],
        query = "";
    encode = encode || false;
    leaf_data = {};

    gatherVisibleLeafNodeData(root);

    query += "algo=" + _.keys(leaf_data).join(",");
    _.each(leaf_data, function(v, k) {
      query += "&" + k + "_id=" + v.join(",");
    });

    // Encode URI.
    if (encode) {
      query = query.replace(/[@=&\?]/g, function(c) {
        var chars = {
          '&': '%26',
          '=': '%3D',
          '?': '%3F',
          '@': '%40'
        };
        return chars[c];
      });
    }

    window.open(base + query);
  }

  // Export tree event handlers.
  // Hack to ensure only one event handler is bound.
  // TODO: Make this purdy.
  $('#cmtv').unbind('click').bind('click', function() {
    exportDataSet("cmtv", true);
  });
  $('#tab').unbind('click').bind('click', function() {
    exportDataSet("tab", false);
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
LSS.collectResults = function(id, data, algo) {

  var self = this;

  self.quorum_id = self.quorum_id || id;

  // Copy trimmed datasets.
  // If the algorithm wasn't enqueued, trimData returns null.
  self.data[algo] = self.trimData(data, algo);

  // Render menu
  if (!_.isNull(self.data[algo])) {
    self.renderMenu(algo);
  }

};

//
// jQuery event handlers
//
$(function() {
  _.each(["#view", "#tools"], function(e) { $(e).hide(); });
  $("input:checkbox, button", "#results-menu").button();

  // Filters menu.
  _.each(["#filters", "#view-tree"], function(e) {
    $(e).button({
      icons: {
        secondary : 'ui-icon-triangle-1-s'
      }
    })
    .click(function() {
      var menu = $(this).parent().next().show().position({
        my: "left top",
        at: "left bottom",
        of: this
      });
      $(document).one('click', function() { menu.hide(); });
      return false;
    })
    .parent().next().hide().menu();
  });

  // Gather checked algos.
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

  // Remove filters
  $("#remove-filters").click(function() {
    var algos = checkedAlgos();

    if (!_.isEmpty(algos)) {
      LSS.removeFilters(algos);
    }
    $("#evalue").val('');
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

