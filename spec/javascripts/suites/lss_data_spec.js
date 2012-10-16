describe("LSS Data", function() {

  var data = getJSONFixture('blast_results.json');

  describe("prepData and flagTopHitPerQuery", function() {
    it("returns null if enqueued equals false", function() {
      expect(LSS.prepData([{"enqueued":false}], 'blastn')).toBeNull();
    });
    it("returns null if results equal false", function() {
      var objs = [{"results":false}],
          algo = 'blastn';
      expect(LSS.prepData(objs, algo)).toBeNull();
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
      expect(prepared[1].top_hit).not.toBeDefined();
      expect(prepared[2].top_hit).not.toBeDefined();
      expect(prepared[3].top_hit).not.toBeDefined();

      _.each(properties, function(p) {
        expect(_.has(prepared[0], p)).toBeTruthy();
      });
    });
  });

  describe("formatResults", function() {
    beforeEach(function() {
      LSS.quorum_id = 1;
    });
    it("formats an array with multiple elements of data and algos", function() {
      spyOn(LSS, 'formatData');

      var prepared = [LSS.prepData(data, 'foo'), LSS.prepData(data, 'bar')],
          formatted = LSS.formatResults(prepared);

      expect(formatted.name).toEqual(LSS.quorum_id);
      expect(_.isArray(formatted.children)).toBeTruthy();

      expect(LSS.formatData).toHaveBeenCalled();

    });
    it("formats an array with one element of data and algo", function() {
      spyOn(LSS, 'formatData').andReturn([]);

      var prepared = [LSS.prepData(data, 'foo')],
          formatted = LSS.formatResults(prepared);

      expect(_.isEmpty(formatted)).toBeTruthy();
    });
    afterEach(function() {
      LSS.quorum_id = null;
    });
  });

  describe("formatData", function() {
    it("returns if data is empty or results equals false", function() {
      var empty = [{}],
          no_results = [{results: false, algo: 'foo'}];
      expect(LSS.formatData(empty)).toEqual({});
      expect(LSS.formatData(no_results)).toEqual({});
    });
    it("returns a formatted data set by group, ref, hit_id, query and hsp", function() {
      var formatted = LSS.formatData(LSS.prepData(data, 'foo'));

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

  describe("flattenData", function() {
    it("flattens an array", function() {
      expect(LSS.flattenData([{foo:'bar'},{},[],{baz:'bam'}])).toEqual([{foo:'bar'},{},{baz:'bam'}]);
    });
  });

  describe("toArray", function() {
    it("convert an object into an array of arrays", function() {
      expect(LSS.toArray({foo:"bar",baz:[]})).toEqual(['bar',[]]);
    });
  });

});
