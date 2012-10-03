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

  describe("prepData and flagTopHitPerQuery", function() {
    it("returns null if enqueued equals false", function() {
      expect(LSS.prepData([{"enqueued":false}], 'blastn')).toBeNull();
    });
    it("returns data if results equals false", function() {
      var objs = [{"results":false}],
          algo = 'blastn',
          ret = _.extend(objs, { "algo": algo });
      expect(LSS.prepData(objs, algo)).toEqual(ret);
    });
    it("preserves wanted props, adds additional props and returns top hit flagged data", function() {
      var prepared = LSS.prepData(data, 'blastn'),
          properties;

      // Properties preserved and added after prepData is called.
      properties = [
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
        "hit_to",
        "ref",
        "ref_id",
        "algo",
        "name",
        "quorum_hit_id",
        "size"
      ];

      expect(prepared[0].top_hit).toBeTruthy();
      expect(prepared[1].to_hit).not.toBeDefined();
      expect(prepared[2].to_hit).not.toBeDefined();
      expect(prepared[3].to_hit).not.toBeDefined();

      _.each(properties, function(p) {
        expect(_.has(prepared[0], p)).toBeTruthy();
      });
    });
  });

  describe("formatResults", function() {
    it("formats an array with multiple elements of data and algos", function() {
      spyOn(LSS, 'formatData');

      var prepared = [LSS.prepData(data, 'foo'), LSS.prepData(data, 'bar')],
          formatted = LSS.formatResults(prepared, ['foo','bar']);

      expect(formatted.name).toBeDefined();
      expect(_.isArray(formatted.children)).toBeTruthy();

      expect(LSS.formatData).toHaveBeenCalled();

    });
    it("formats an array with one element of data and algo", function() {
      spyOn(LSS, 'formatData').andReturn([]);

      var prepared = [LSS.prepData(data, 'foo')],
          formatted = LSS.formatResults(prepared, ['foo']);

      expect(_.isEmpty(formatted)).toBeTruthy();
    });
  });

  describe("formatData", function() {
    it("returns if data is empty or results equals false", function() {
      var empty = {},
          no_results = [{results: false}],
          results = {name: 'foo', children: []};
      expect(LSS.formatData(empty, 'foo')).toEqual(results);
      expect(LSS.formatData(no_results, 'foo')).toEqual(results);
    });
    it("returns a formatted data set by group, ref, hit_id, query and hsp", function() {
      var formatted = LSS.formatData(LSS.prepData(data, 'foo'), 'foo');

      expect(formatted.name).toEqual('foo');
      expect(_.isArray(formatted.children)).toBeTruthy();
      expect(formatted.children[0].name).toEqual('lotja_genome_2_5');
      expect(formatted.children[0].children[0].name).toEqual('Chr2');
      expect(formatted.children[0].children[0].children[0].name)
        .toEqual('TOG894063');
      expect(formatted.children[0].children[0].children[0].children[0].name)
        .toEqual('q:299-684::h:22469244-22468859');
    });
  });

  describe("formatGroups", function() {
    it("groups data by hit_display_id and each sub group by query for formatData", function() {
      var groups = LSS.formatGroups(LSS.prepData(data, 'foo'));
      expect(_.keys(groups)).toEqual([
        'lotja_genome_2_5:Chr2',
        'glyma_genome_rel_1_01:Gm02',
        'medtr_genome_Mt3.5.2:chr5',
        'cajca_genome_1.0:CcLG06'
      ]);
      expect(_.keys(groups['lotja_genome_2_5:Chr2'])).toEqual(['TOG894063']);
    });
  });

  describe("highlightView", function() {
    it("highlights #table", function() {
      var table = $("<div id='table'></div>");
      LSS.highlightView(table);
      expect(table).toHaveClass("ui-state-highlight");
    });
  });

  describe("gatherDataByAlgorithm", function() {
    it("combines cached data into an array of data", function() {
      LSS.algos = ['foo', 'baz'];
      LSS.data["foo"] = "bar";
      LSS.data["baz"] = "bam";
      expect(LSS.gatherDataByAlgorithm()).toEqual(['bar','bam']);
    });
    afterEach(function() {
      LSS.data = {};
    });
  });

  describe("setCurrentData", function() {
    it("gathers data when cached data is undefined", function() {
      LSS.algos = ['foo'];
      spyOn(LSS, 'gatherDataByAlgorithm');
      LSS.setCurrentData();
      expect(LSS.gatherDataByAlgorithm).toHaveBeenCalled();
    });
    it("gathers data when cached data is null", function() {
      LSS.data['cached'] = null;
      LSS.algos = ['foo'];
      spyOn(LSS, 'gatherDataByAlgorithm');
      LSS.setCurrentData();
      expect(LSS.gatherDataByAlgorithm).toHaveBeenCalled();
    });
    it("uses cached data if set", function() {
      LSS.data['foo'] = 'bar';
      LSS.data['cached'] = LSS.data['foo']; // Set cached data.
      LSS.algos = ['foo'];
      spyOn(LSS, 'gatherDataByAlgorithm');
      var data = LSS.setCurrentData();
      expect(LSS.gatherDataByAlgorithm).not.toHaveBeenCalled();
      expect(data).toEqual(LSS.data['cached']);
    });
    afterEach(function() {
      LSS.data = {};
      LSS.algos = [];
    });
  });

  describe("setData", function() {
    it("uses passed data when set", function() {
      var foo = {bar: "baz"};
      LSS.algos = ['foo'];
      spyOn(LSS, 'gatherDataByAlgorithm');
      var data = LSS.setData(foo);
      expect(LSS.gatherDataByAlgorithm).not.toHaveBeenCalled();
      expect(data).toEqual(foo);
    });
    it("calls setCurrentData when passed data is undefined", function() {
      spyOn(LSS, 'setCurrentData');
      LSS.setData();
      expect(LSS.setCurrentData).toHaveBeenCalled();
    });
    it("calls setCurrentData when passed data is null", function() {
      spyOn(LSS, 'setCurrentData');
      LSS.setData(null);
      expect(LSS.setCurrentData).toHaveBeenCalled();
    });
    afterEach(function() {
      LSS.data = {};
      LSS.algos = [];
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

  describe("flattenData", function() {
    it("flattens an array", function() {
      expect(LSS.flattenData(['foo','bar','',[]])).toEqual(['foo','bar','']);
    });
  });

  describe("toArray", function() {
    it("convert an object into an array of arrays", function() {
      expect(LSS.toArray({foo:"bar",baz:[]})).toEqual(['bar',[]]);
    });
  });

  describe("renderTable", function() {
    beforeEach(function() {
      LSS.data['foo'] = LSS.formatResults([LSS.prepData(data, 'foo')], ['foo']);
    });
    it("renders table template", function() {
      spyOn(_, 'template');
      LSS.renderTable(LSS.data['foo']);
      expect(_.template).toHaveBeenCalled();
    });
    afterEach(function() {
      LSS.data = {};
      LSS.tableData = {};
    });
  });

  describe("renderPartition", function() {
    beforeEach(function() {
      LSS.data['foo'] = LSS.prepData(data, 'foo');
      loadFixtures('results.html');
    });
    // TODO: Add specs that interact with the partition view.
    it("renders partition view", function() {
      LSS.algos = ['foo'];
      spyOn(LSS, 'setData').andReturn(LSS.data);
      spyOn(window, 'innerHeight');
      LSS.renderPartition(LSS.data['foo']);
      expect($("#partition-results")).toContainHtml('</g></svg></div>');
    });
    afterEach(function() {
      LSS.data = {};
    });
  });
});
