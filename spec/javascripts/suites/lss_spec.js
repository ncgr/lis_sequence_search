describe("LSS", function() {

  var data = getJSONFixture('blast_results.json');

  describe("namespace", function() {
    it("creates a namespace if one doesn't exist", function() {
      LSS.namespace('LSS.foo.bar');
      expect(LSS.foo).toBeDefined();
      expect(LSS.foo.bar).toBeDefined();
    });

    it("is nondestructive", function() {
      LSS.foo = "bar";
      LSS.namespace('LSS.foo');
      expect(LSS.foo).toEqual('bar');
    });
  });

  describe("collectResults", function() {
    it("collects Quorum's results, preps data and renders menu", function() {
      var id = 10,
          algo = 'blastn';

      spyOn(LSS, 'prepData');
      spyOn(LSS, 'renderMenu');

      LSS.collectResults(id, data, algo);

      expect(LSS.quorum_id).toEqual(id);
      expect(LSS.prepData).toHaveBeenCalledWith(data, algo);
      expect(LSS.renderMenu).toHaveBeenCalledWith(algo);
    });
  });

  describe("renderMenu", function() {
    it("renders LSS menu containing algorithm button(s)", function() {
      _.each(['blastn','blastx'], function(a) {
        LSS.renderMenu(a);
      });

      expect($("#algorithms")).not.toBeEmpty();
      expect($("#view")).not.toBeHidden();
    });
  });

  describe("renderView", function() {
    it("renders and highlights current view", function() {
      spyOn(LSS, 'renderTable');
      spyOn(LSS, 'highlightView');

      LSS.renderView(null, LSS.renderTable, "#table");

      expect(LSS.currentView).toEqual(LSS.renderTable);
      expect(LSS.highlightView).toHaveBeenCalledWith("#table");
      expect(LSS.renderTable).toHaveBeenCalledWith(null);
    });

    it("renders partition view when view is not defined", function() {
      spyOn(LSS, 'renderPartition');
      spyOn(LSS, 'highlightView');

      LSS.renderView(null);

      expect(LSS.currentView).toEqual(LSS.renderPartition);
      expect(LSS.highlightView).not.toHaveBeenCalled();
      expect(LSS.renderPartition).toHaveBeenCalledWith(null);
    });

    afterEach(function() {
      LSS.currentView = null;
    });
  });

});
