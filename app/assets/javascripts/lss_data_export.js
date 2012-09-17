//
// LSS Data Export Functions
//
// Author: Ken Seal
//---------------------------------------------------------------------------//

//
// Recursively gather visible node data.
//
var gatherVisibleLeafNodeData = function gatherVisibleLeafNodeData(data) {

  if (data.children) {
    data.children.forEach(gatherVisibleLeafNodeData);
  } else {
    if (_.isArray(LSS.leaf_data[data.algo])) {
      LSS.leaf_data[data.algo].push(data);
    } else {
      LSS.leaf_data[data.algo] = [];
      LSS.leaf_data[data.algo].push(data);
    }
  }

};

//
// Export data set.
//
var exportDataSet = function exportDataSet(data, type, encode) {
  var base = LSS.exportUrls[type],
      ids = [],
      query = "",
      keys;

  encode = encode || false;
  LSS.leaf_data = {};

  // Format the data before generating a URL.
  //
  // If the data is in an array, the call to exportDataSet came from a flat
  // view (i.e. table view).
  //
  // If the data is an object, the call to exportDataSet came from a nested
  // view (i.e. d3 partition view).
  if (_.isArray(data)) {
    LSS.leaf_data = _.groupBy(data, 'algo');
  } else {
    gatherVisibleLeafNodeData(data);
  }

  keys = _.keys(LSS.leaf_data);

  // Generate the query string.
  //
  // Ex: foo?algo=a1,a2&a1_id=1,2&a2_id=3,4
  query += "algo=" + keys.join(",");
  _.each(LSS.leaf_data, function(v, k) {
    _.each(v, function(d) {
      ids.push(d.id);
    });
    query += "&" + k + "_id=" + ids.join(",");
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
};

//
// End Data Export
//---------------------------------------------------------------------------//
