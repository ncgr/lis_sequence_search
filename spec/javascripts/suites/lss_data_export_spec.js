describe("LSS Data Export", function() {

  var data = getJSONFixture('blast_results.json'),
      formatted = LSS.formatResults([LSS.prepData(data, 'blastn')],['blastn']);

  describe("gatherVisibleLeafNodeData", function() {
    beforeEach(function() {
      LSS.leaf_data = {};
    });
    it("recursively gathers visible nodes in a nested object -all visible", function() {
      gatherVisibleLeafNodeData(formatted);
      expect(LSS.leaf_data['blastn'].length).toEqual(4);
    });
    it("recursively gathers visible nodes in a nested object - toggle one node", function() {
      // Mimic node toggle.
      formatted.children[0].children = null;
      gatherVisibleLeafNodeData(formatted);
      expect(LSS.leaf_data['blastn'].length).toEqual(3);
    });
    afterEach(function() {
      LSS.leaf_data = null;
    });
  });

  describe("exportDataSet", function() {
    beforeEach(function() {
      LSS.exportUrls.foo = "http://foo.com?";
    });
    it("opens url without encoding", function() {
      spyOn(window, 'open');
      exportDataSet(LSS.prepData(data, 'blastn'), 'foo', false);
      expect(window.open).toHaveBeenCalledWith('http://foo.com?algo=blastn&blastn_id=34147,1989,1995,1993');
    });
    it("opens url with encoding", function() {
      spyOn(window, 'open');
      exportDataSet(LSS.prepData(data, 'blastn'), 'foo', true);
      expect(window.open).toHaveBeenCalledWith('http://foo.com?algo%3Dblastn%26blastn_id%3D34147,1989,1995,1993');
    });
    afterEach(function() {
      LSS.leaf_data = null;
      LSS.exportUrls.foo = null;
    });
  });

});
