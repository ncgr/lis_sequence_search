//
// LSS Data
//----------------------------------------------------------------------------//

//
// Flatten an array of arrays of objects into an array of objects.
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
  // Populate self.emptyReports and return null without result set.
  if (data[0].results === false) {
    _.extend(data[0], { "algo": algo });
    self.emptyReports.push(data[0]);
    return null;
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
LSS.gatherDataByAlgorithm = function() {

  var self = this,
      data = [];

  _.each(self.algos, function(a) {
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
      cached = "cached";

  if (_.isNull(self.data[cached]) || _.isUndefined(self.data[cached])) {
    data = self.gatherDataByAlgorithm();
  } else {
    data = self.data[cached];
  }

  return data;

};

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
LSS.formatData = function(data) {

  var self = this,
      groups = {},
      formatted = {},
      hit,
      found;

  if (_.isEmpty(data) || _.isUndefined(data[0].algo) || data[0].results === false) {
    return formatted;
  }

  formatted = {
    "name": data[0].algo,
    "children": []
  };


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
LSS.formatResults = function(data) {

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
      formatted.children.push(self.formatData(data[i]));
    }
  } else {
    formatted = self.formatData(data[0]);
  }

  return formatted;

};

//
// End LSS Data
//----------------------------------------------------------------------------//
