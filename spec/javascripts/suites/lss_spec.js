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
    it("collects Quorum's results and preps data", function() {
      var algo = 'blastn';

      spyOn(LSS, 'prepData');
      spyOn(LSS, 'renderMenu');

      LSS.collectResults(data, algo);

      expect(LSS.quorum_id).not.toBeEmpty();
      expect(LSS.prepData).toHaveBeenCalledWith(data, algo);
      expect(LSS.renderMenu).not.toHaveBeenCalled();
    });
    it("calls renderMenu when all algorithms have returned", function() {
      var algo = 'blastn';

      LSS.data = {a:1,b:2,c:3};

      spyOn(LSS, 'prepData');
      spyOn(LSS, 'renderMenu');

      LSS.collectResults(data, algo);

      expect(LSS.quorum_id).not.toBeEmpty();
      expect(LSS.prepData).toHaveBeenCalledWith(data, algo);
      expect(LSS.renderMenu).toHaveBeenCalled();
    });
  });

  describe("renderMenu", function() {
    beforeEach(function() {
      loadFixtures('results.html');
    });
    it("renders LSS menu", function() {
      spyOn(LSS, 'renderView');
      LSS.renderMenu('blastn');
      expect(LSS.renderView).toHaveBeenCalled();
      expect($("#tools")).not.toBeEmpty();
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
    it("renders dual view when view is not defined", function() {
      spyOn(LSS, 'renderDualView');
      spyOn(LSS, 'highlightView');

      LSS.renderView(null);

      expect(LSS.currentView).toEqual(LSS.renderDualView);
      expect(LSS.highlightView).not.toHaveBeenCalled();
      expect(LSS.renderDualView).toHaveBeenCalledWith(null);
    });
    it("renders empty reports", function() {
      spyOn(LSS, 'renderDualView');
      spyOn(LSS, 'highlightView');
      spyOn(LSS, 'renderEmptyReports');

      LSS.renderView(null);
      expect(LSS.renderEmptyReports).toHaveBeenCalled();
    });
    afterEach(function() {
      LSS.currentView = null;
    });
  });

  describe("highlightView", function() {
    it("highlights #table", function() {
      var table = $("<div id='table'></div>");
      LSS.highlightView(table);
      expect(table).toHaveClass("ui-state-highlight");
    });
  });

  describe("filters", function() {
    beforeEach(function() {
      LSS.data['foo'] = LSS.prepData(data, 'foo');
    });
    describe("expandTopHits", function() {
      it("returns when checkedAlgos is empty", function() {
        LSS.algos = [];
        spyOn(LSS, 'renderView');
        LSS.expandTopHits();
        expect(LSS.renderView).not.toHaveBeenCalled();
      });
      it("returns objects where top_hit equals true", function() {
        LSS.algos = ['foo'];
        spyOn(LSS, 'renderView');
        LSS.expandTopHits();
        expect(LSS.renderView).toHaveBeenCalledWith(LSS.data['cached']);
        expect(LSS.data['cached'][0].length).toEqual(1);
      });
    });

    describe("expandTopHitPerRefSeq", function() {
      it("returns when checkedAlgos is empty", function() {
        LSS.algos = [];
        spyOn(LSS, 'renderView');
        LSS.expandTopHitPerRefSeq();
        expect(LSS.renderView).not.toHaveBeenCalled();
      });
      it("returns objects containing top hit per reference sequence", function() {
        LSS.algos = ['foo'];
        spyOn(LSS, 'renderView');
        LSS.expandTopHitPerRefSeq();
        expect(LSS.renderView).toHaveBeenCalledWith(LSS.data['cached']);
        expect(LSS.data['cached'][0].length).toEqual(4);
      });
    });

    describe("expandTopHitPerRef", function() {
      it("returns when checkedAlgos is empty", function() {
        LSS.algos = [];
        spyOn(LSS, 'renderView');
        LSS.expandTopHitPerRef();
        expect(LSS.renderView).not.toHaveBeenCalled();
      });
      it("returns objects containing top hit per reference", function() {
        LSS.algos = ['foo'];
        spyOn(LSS, 'renderView');
        LSS.expandTopHitPerRef();
        expect(LSS.renderView).toHaveBeenCalledWith(LSS.data['cached']);
        expect(LSS.data['cached'][0].length).toEqual(4);
      });
    });

    describe("removeFilters", function() {
      it("returns when checkedAlgos is empty", function() {
        LSS.algos = [];
        spyOn(LSS, 'renderView');
        LSS.removeFilters();
        expect(LSS.renderView).not.toHaveBeenCalled();
      });
      it("clears cached data and renders current view with original data set", function() {
        LSS.algos = ['foo'];
        spyOn(LSS, 'renderView');
        LSS.data['cached'] = LSS.data['foo'];
        LSS.removeFilters();
        expect(LSS.renderView).toHaveBeenCalledWith(null);
        expect(LSS.data['cached']).toBeNull();
      });
    });

    describe("evalueFilter", function() {
      it("returns when checkedAlgos is empty", function() {
        LSS.algos = [];
        spyOn(LSS, 'renderView');
        LSS.evalueFilter();
        expect(LSS.renderView).not.toHaveBeenCalled();
      });
      it("returns objects containing evalues > 0.0", function() {
        LSS.algos = ['foo'];
        spyOn(LSS, 'renderView');
        LSS.evalueFilter("0.0");
        expect(LSS.renderView).toHaveBeenCalledWith(LSS.data['cached']);
        expect(LSS.data['cached'][0].length).toEqual(1);
      });
      it("returns objects containing evalues > 1e-100", function() {
        LSS.algos = ['foo'];
        spyOn(LSS, 'renderView');
        LSS.evalueFilter("1e-100");
        expect(LSS.renderView).toHaveBeenCalledWith(LSS.data['cached']);
        expect(LSS.data['cached'][0].length).toEqual(3);
      });
    });
    afterEach(function() {
      LSS.data = {};
      LSS.algos = [];
    });
  });

  describe("sortable", function() {
    beforeEach(function() {
      LSS.tableData = data;
    });
    it("returns if data is null", function() {
      LSS.tableData = null;
      spyOn(LSS, 'renderTable');
      LSS.sortable('query');
      expect(LSS.renderTable).not.toHaveBeenCalled();
    });
    it("returns if data doesn't have property", function() {
      spyOn(LSS, 'renderTable');
      LSS.sortable('unknown');
      expect(LSS.renderTable).not.toHaveBeenCalled();
    });
    it("sorts data by property using _.sortBy()", function() {
      spyOn(LSS, 'renderTable');
      LSS.sortable('ref_id');
      expect(LSS.renderTable).toHaveBeenCalled();
      expect(LSS.sortDir).toEqual('desc');
    });
    it("sorts data by property using _.sortBy() with pased dataType", function() {
      // Spy on top level function parseFloat();
      var parseFloat = jasmine.createSpy();
      spyOn(LSS, 'renderTable');
      LSS.sortable('evalue', parseFloat);
      expect(parseFloat).toHaveBeenCalled();
      expect(parseFloat.callCount).toEqual(4);
      expect(LSS.renderTable).toHaveBeenCalled();
      expect(LSS.sortDir).toEqual('asc');
    })
    afterEach(function() {
      LSS.tableData = {};
    });
  });

  describe("renderEmptyReports", function() {
    beforeEach(function() {
      LSS.emptyReports = [{algo:'foo'}];
      LSS.emptyReportDisplayed = false;
      loadFixtures('results.html');
    });
    it("renders collaspable message when a blast report is empty", function() {
      var msg = "<span class='ui-icon ui-icon-info' " +
        "style='float: left; margin-right: .3em;'></span>" +
        "foo report empty";
      LSS.renderEmptyReports();
      expect($(".empty-report")).toContainHtml(msg);
      expect(LSS.emptyReportDisplayed).toBeTruthy();
    });
    it("returns when LSS.emptyReporDisplayed is true", function() {
      var msg = "<span class='ui-icon ui-icon-info' " +
        "style='float: left; margin-right: .3em;'></span>" +
        "foo report empty";
      LSS.emptyReportDisplayed = true;
      LSS.renderEmptyReports();
      expect($("body")).not.toContainHtml(msg);
    });
    afterEach(function() {
      LSS.emptyReports = [];
      LSS.emptyReportDisplayed = false;
    });
  });

  describe("renderTable", function() {
    beforeEach(function() {
      LSS.data['foo'] = LSS.formatResults([LSS.prepData(data, 'foo')], ['foo']);
    });
    it("renders table template", function() {
      spyOn(LSS, 'flattenData');
      spyOn(_, 'template');
      LSS.renderTable(LSS.data['foo']);
      expect(LSS.flattenData).toHaveBeenCalledWith(LSS.data['foo']);
      expect(_.template).toHaveBeenCalled();
    });
    afterEach(function() {
      LSS.data = {};
      LSS.tableData = {};
    });
  });

  describe("renderPartition", function() {
    beforeEach(function() {
      LSS.quorum_id = 1;
      LSS.data['foo'] = LSS.prepData(data, 'foo');
      loadFixtures('results.html');
    });
    // TODO: Add specs that interact with the partition view.
    it("renders partition view", function() {
      spyOn(LSS, 'setData').andReturn(LSS.data);
      spyOn(window, 'innerHeight');
      LSS.renderPartition(LSS.data['foo']);
      expect($("#partition-results")).toContainHtml('</g></svg></div>');
    });
    afterEach(function() {
      LSS.quorum_id = null;
      LSS.data = {};
    });
  });
});
