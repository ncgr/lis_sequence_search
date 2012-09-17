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
      var algo = 'blastn';

      spyOn(LSS, 'prepData');
      spyOn(LSS, 'renderMenu');

      LSS.collectResults(data, algo);

      expect(LSS.quorum_id).not.toBeEmpty();
      expect(LSS.prepData).toHaveBeenCalledWith(data, algo);
      expect(LSS.renderMenu).toHaveBeenCalledWith(algo);
    });
  });

  describe("renderMenu", function() {
    beforeEach(function() {
      loadFixtures('results.html');
    });
    it("returns if algo is not set", function() {
      LSS.renderMenu();
      expect($("#algorithms")).toBeEmpty();
    });
    it("renders LSS menu containing algorithm button(s)", function() {
      LSS.renderMenu('blastn');
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

  describe("prepData and flagTopHitPerQuery", function() {
    it("returns null if enqueued equals false", function() {
      expect(LSS.prepData([{"enqueued":false}], 'blastn')).toBeNull();
    });
    it("returns data if results equals false", function() {
      var objs = [{"results":false}];
      expect(LSS.prepData(objs, 'blastn')).toEqual(objs);
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
      expect(formatted.children[0].name).toEqual('lj_genome_2_5');
      expect(formatted.children[0].children[0].name).toEqual('lj_chr2');
      expect(formatted.children[0].children[0].children[0].name).toEqual('TOG894063');
      expect(formatted.children[0].children[0].children[0].children[0].name).toEqual('q:299-684::h:22469244-22468859');
    });
  });

  describe("formatGroups", function() {
    it("groups data by hit_display_id and each sub group by query for formatData", function() {
      var groups = LSS.formatGroups(LSS.prepData(data, 'foo'));
      expect(_.keys(groups)).toEqual(['lj_genome_2_5:lj_chr2','gm_genome_rel_1_01:gm02','mt_genome_3_5_1:mt_3_5_1_chr5','cc_genome_1_0:CcLG06']);
      expect(_.keys(groups['lj_genome_2_5:lj_chr2'])).toEqual(['TOG894063']);
    });
  });

  describe("formatLinkouts", function() {
    it("returns an array of objects containing urls and names", function() {
      spyOn(LSS, 'addGbrowseLinkouts');
      var links = LSS.formatLinkouts(data[0]);
      expect(LSS.addGbrowseLinkouts).toHaveBeenCalledWith(data[0]);
      expect(_.isArray(links)).toBeTruthy();
    });
  });

  describe("addGbrowseLinkouts", function() {
    it("formats gm_genome linkout", function() {
      spyOn(LSS, 'addGm');
      var links = LSS.addGbrowseLinkouts(data[1]);
      expect(LSS.addGm).toHaveBeenCalledWith(data[1]);
      expect(_.isArray(links)).toBeTruthy();
    });
    it("formats mt_genome linkout", function() {
      spyOn(LSS, 'addMt');
      var links = LSS.addGbrowseLinkouts(data[2]);
      expect(LSS.addMt).toHaveBeenCalledWith(data[2]);
      expect(_.isArray(links)).toBeTruthy();
    });
    it("formats lj_genome linkout", function() {
      spyOn(LSS, 'addLj');
      var links = LSS.addGbrowseLinkouts(data[0]);
      expect(LSS.addLj).toHaveBeenCalledWith(data[0]);
      expect(_.isArray(links)).toBeTruthy();
    });
    it("formats cc_genome linkout", function() {
      spyOn(LSS, 'addCc');
      var links = LSS.addGbrowseLinkouts(data[3]);
      expect(LSS.addCc).toHaveBeenCalledWith(data[3]);
      expect(_.isArray(links)).toBeTruthy();
    });
  });

  describe("addGm", function() {
    it("formats a url for Soybase", function() {
      spyOn(LSS, 'formatGbrowseUrl');
      var url = LSS.addGm(data[1]);
      expect(url[0].name).toEqual("Glycine max - Soybase");
      expect(LSS.formatGbrowseUrl).toHaveBeenCalledWith(
        data[1],
        LSS.gbrowseUrls.gm_soybase,
        "soybase"
      );
    });
  });

  describe("addMt", function() {
    it("formats a url for JCVI", function() {
      spyOn(LSS, 'formatGbrowseUrl');
      var url = LSS.addMt(data[2]);
      expect(url[0].name).toEqual("Medicago truncatula - JCVI");
      expect(LSS.formatGbrowseUrl).toHaveBeenCalledWith(
        data[2],
        LSS.gbrowseUrls.mt_jcvi,
        "jcvi"
      );
    });
    it("formats a url for Hapmap", function() {
      spyOn(LSS, 'formatGbrowseUrl');
      var url = LSS.addMt(data[2]);
      expect(url[1].name).toEqual("Medicago truncatula - Hapmap");
      expect(LSS.formatGbrowseUrl).toHaveBeenCalledWith(
        data[2],
        LSS.gbrowseUrls.mt_hapmap,
        "hapmap"
      );
    });
    it("formats a url for LIS", function() {
      spyOn(LSS, 'formatGbrowseUrl');
      var url = LSS.addMt(data[2]);
      expect(url[2].name).toEqual("Medicago truncatula - LIS");
      expect(LSS.formatGbrowseUrl).toHaveBeenCalledWith(
        data[2],
        LSS.gbrowseUrls.mt_lis,
        "medtr-lis"
      );
    });
  });

  describe("addLj", function() {
    it("formats a url for Kazusa", function() {
      spyOn(LSS, 'formatGbrowseUrl');
      var url = LSS.addLj(data[0]);
      expect(url[0].name).toEqual("Lotus japonicus - Kazusa");
      expect(LSS.formatGbrowseUrl).toHaveBeenCalledWith(
        data[0],
        LSS.gbrowseUrls.lj_kazusa
      );
    });
  });

  describe("addCc", function() {
    it("formats a url for Cc LIS", function() {
      spyOn(LSS, 'formatGbrowseUrl');
      var url = LSS.addCc(data[3]);
      expect(url[0].name).toEqual("Cajanus cajan - LIS");
      expect(LSS.formatGbrowseUrl).toHaveBeenCalledWith(
        data[3],
        LSS.gbrowseUrls.cc_lis,
        "cajca-lis"
      );
    });
  });

  describe("addGf", function() {
    it("formats a url for Gf LIS", function() {
      spyOn(LSS, 'formatGbrowseUrl');
      var gf = {ref: "genefam_20120817_protein", ref_id: 12345};
      var url = LSS.addGf(gf);
      expect(url[0].name).toEqual("Gene family consensus - LIS");
      expect(LSS.formatGbrowseUrl).toHaveBeenCalledWith(
        gf,
        LSS.gbrowseUrls.gf_lis,
        "gene_family-lis"
      );
    });
  });

  describe("formatGbrowseUrl", function() {

    describe("formats start and stop minding viewing interval", function() {
      it("where start < stop and start < interval (50000)", function() {
        var fake = {hit_display_id:"foo:bar",hit_from:100,hit_to:101,query:"q"},
        url = LSS.formatGbrowseUrl(fake, LSS.gbrowseUrls.gm_soybase);
        expect(url).toMatch('start=1;stop=50101');
      });
      it("where start > stop and start < interval (50000)", function() {
        var fake = {hit_display_id:"foo:bar",hit_from:101,hit_to:100,query:"q"},
        url = LSS.formatGbrowseUrl(fake, LSS.gbrowseUrls.gm_soybase);
        expect(url).toMatch('start=1;stop=50101');
      });
      it("where start < stop and start > interval (50000)", function() {
        var fake = {hit_display_id:"foo:bar",hit_from:60000,hit_to:60001,query:"q"},
        url = LSS.formatGbrowseUrl(fake, LSS.gbrowseUrls.gm_soybase);
        expect(url).toMatch('start=10000;stop=110001');
      });
      it("where start > stop and start > interval (50000)", function() {
        var fake = {hit_display_id:"foo:bar",hit_from:60001,hit_to:60000,query:"q"},
        url = LSS.formatGbrowseUrl(fake, LSS.gbrowseUrls.gm_soybase);
        expect(url).toMatch('start=10000;stop=110001');
      });
    });

    it("formats gbrowse url for soybase", function() {
      var url = LSS.formatGbrowseUrl(data[1], LSS.gbrowseUrls.gm_soybase, "soybase");
      expect(url).not.toMatch('%');
      expect(url).toEqual('http://soybase.org/gb2/gbrowse/gmax1.01/?ref=gm02;start=2934784;stop=3034942;version=100;cache=on;drag_and_drop=on;show_tooltips=on;grid=on;add=gm02+LIS+LIS_Query_TOG894063+2984942..2984784');
    });
    it("formats gbrowse url for jcvi", function() {
      var url = LSS.formatGbrowseUrl(data[1], LSS.gbrowseUrls.mt_jcvi, "jcvi");
      expect(url).not.toMatch('%');
      expect(url).toEqual('http://www.jcvi.org/cgi-bin/gb2/gbrowse/mtruncatula/?ref=chr2;start=2934784;stop=3034942;width=1024;version=100;icache=on;drag_and_drop=on;show_tooltips=on;grid=on;label=Gene-Transcripts_all-Transcripts_Bud-Transcripts_Blade-Transcripts_Root-Transcripts_Flower-Transcripts_Seed-Transcripts_mtg-Gene_Models-mt_fgenesh-genemarkHMM-genscan-fgenesh-TC_poplar-TC_maize-TC_arabidopsis-TC_Lotus-TC_soybean-TC_cotton-TC_medicago-TC_rice-TC_sorghum;add=chr2+LIS+LIS_Query_TOG894063+2984942..2984784');
    });
    it("formats gbrowse url for medtr-lis", function() {
      var url = LSS.formatGbrowseUrl(data[1], LSS.gbrowseUrls.mt_lis, "medtr-lis");
      expect(url).not.toMatch('%');
      expect(url).toEqual('http://medtr.comparative-legumes.org/gb2/gbrowse/3.5.1/?ref=gm02;start=2934784;stop=3034942;width=1024;version=100;flip=0;grid=1;add=gm02+LIS+LIS_Query_TOG894063+2984942..2984784');
    });
    it("formats gbrowse url for hapmap", function() {
      var url = LSS.formatGbrowseUrl(data[1], LSS.gbrowseUrls.mt_hapmap, "hapmap");
      expect(url).not.toMatch('%');
      expect(url).toEqual('http://www.medicagohapmap.org/cgi-bin/gbrowse/mthapmap/?q=gm2:2934784..3034942;t=Genes+Transcript+ReadingFrame+Translation+SNP+SNP_HM005+CovU_HM005+SNP_HM006+CovU_HM006+SNP_HM029+CovU_HM029;c=1;add=gm2+LIS+LIS_Query_TOG894063+2984942..2984784');
    });
    it("formats gbrowse url for cajca-lis", function() {
      var url = LSS.formatGbrowseUrl(data[1], LSS.gbrowseUrls.cc_lis, "cajca-lis");
      expect(url).not.toMatch('%');
      expect(url).toEqual('http://cajca.comparative-legumes.org/gb2/gbrowse/1.0/?ref=gm02;start=2934784;stop=3034942;width=1024;version=100;flip=0;grid=1;add=gm02+LIS+LIS_Query_TOG894063+2984942..2984784');
    });
    // kazusa is the only url with valid %%s
    it("formats gbrowse url for kazusa", function() {
      var url = LSS.formatGbrowseUrl(data[1], LSS.gbrowseUrls.lj_kazusa);
      expect(url).toEqual('http://gsv.kazusa.or.jp/cgi-bin/gbrowse/lotus/?ref=gm02;start=2934784;stop=3034942;width=1024;version=100;label=contig-phase3-phase1%%2C2-annotation-GMhmm-GenScan-blastn-tigrgi-blastx-marker;grid=on;add=gm02+LIS+LIS_Query_TOG894063+2984942..2984784');
    });
    it("formats gbrowse url for gene_family-lis", function() {
      var gf = {
        hit_display_id: "genefam_20120817_protein:12345",
        ref: "genefam_20120817_protein",
        ref_id: 12345
      };
      var url = LSS.formatGbrowseUrl(gf, LSS.gbrowseUrls.gf_lis, "gene_family-lis");
      expect(url).not.toMatch('%');
      expect(url).toEqual('http://leggle.comparative-legumes.org/gene_families/name=' + gf.ref_id);
    });
  });

  describe("highlightView", function() {
    it("highlights #table", function() {
      var table = $("<div id='table'></div>");
      LSS.highlightView(table);
      expect(table).toHaveClass("ui-state-highlight");
    });
  });

  describe("gatherCheckedData", function() {
    it("combines cached data into an array of data", function() {
      LSS.data["foo"] = "bar";
      LSS.data["baz"] = "bam";
      expect(LSS.gatherCheckedData(['foo','baz'])).toEqual(['bar','bam']);
    });
    afterEach(function() {
      LSS.data = {};
    });
  });

  describe("filters", function() {
    beforeEach(function() {
      LSS.data['foo'] = LSS.prepData(data, 'foo');
    });
    describe("expandTopHits", function() {
      it("returns when checkedAlgos is empty", function() {
        spyOn(LSS, 'checkedAlgos').andReturn([]);
        spyOn(LSS, 'renderView');
        LSS.expandTopHits();
        expect(LSS.renderView).not.toHaveBeenCalled();
      });
      it("returns objects where top_hit equals true", function() {
        spyOn(LSS, 'checkedAlgos').andReturn(['foo']);
        spyOn(LSS, 'renderView');
        LSS.expandTopHits();
        expect(LSS.renderView).toHaveBeenCalledWith(LSS.data['cached']);
        expect(LSS.data['cached'][0].length).toEqual(1);
      });
    });

    describe("expandTopHitPerRefSeq", function() {
      it("returns when checkedAlgos is empty", function() {
        spyOn(LSS, 'checkedAlgos').andReturn([]);
        spyOn(LSS, 'renderView');
        LSS.expandTopHitPerRefSeq();
        expect(LSS.renderView).not.toHaveBeenCalled();
      });
      it("returns objects containing top hit per reference sequence", function() {
        spyOn(LSS, 'checkedAlgos').andReturn(['foo']);
        spyOn(LSS, 'renderView');
        LSS.expandTopHitPerRefSeq();
        expect(LSS.renderView).toHaveBeenCalledWith(LSS.data['cached']);
        expect(LSS.data['cached'][0].length).toEqual(4);
      });
    });

    describe("expandTopHitPerRef", function() {
      it("returns when checkedAlgos is empty", function() {
        spyOn(LSS, 'checkedAlgos').andReturn([]);
        spyOn(LSS, 'renderView');
        LSS.expandTopHitPerRef();
        expect(LSS.renderView).not.toHaveBeenCalled();
      });
      it("returns objects containing top hit per reference", function() {
        spyOn(LSS, 'checkedAlgos').andReturn(['foo']);
        spyOn(LSS, 'renderView');
        LSS.expandTopHitPerRef();
        expect(LSS.renderView).toHaveBeenCalledWith(LSS.data['cached']);
        expect(LSS.data['cached'][0].length).toEqual(4);
      });
    });

    describe("removeFilters", function() {
      it("returns when checkedAlgos is empty", function() {
        spyOn(LSS, 'checkedAlgos').andReturn([]);
        spyOn(LSS, 'renderView');
        LSS.removeFilters();
        expect(LSS.renderView).not.toHaveBeenCalled();
      });
      it("clears cached data and renders current view with original data set", function() {
        spyOn(LSS, 'checkedAlgos').andReturn(['foo']);
        spyOn(LSS, 'renderView');
        LSS.data['cached'] = LSS.data['foo'];
        LSS.removeFilters();
        expect(LSS.renderView).toHaveBeenCalledWith(null);
        expect(LSS.data['cached']).toBeNull();
      });
    });

    describe("evalueFilter", function() {
      it("returns when checkedAlgos is empty", function() {
        spyOn(LSS, 'checkedAlgos').andReturn([]);
        spyOn(LSS, 'renderView');
        LSS.evalueFilter();
        expect(LSS.renderView).not.toHaveBeenCalled();
      });
      it("returns objects containing evalues > 0.0", function() {
        spyOn(LSS, 'checkedAlgos').andReturn(['foo']);
        spyOn(LSS, 'renderView');
        LSS.evalueFilter("0.0");
        expect(LSS.renderView).toHaveBeenCalledWith(LSS.data['cached']);
        expect(LSS.data['cached'][0].length).toEqual(1);
      });
      it("returns objects containing evalues > 1e-100", function() {
        spyOn(LSS, 'checkedAlgos').andReturn(['foo']);
        spyOn(LSS, 'renderView');
        LSS.evalueFilter("1e-100");
        expect(LSS.renderView).toHaveBeenCalledWith(LSS.data['cached']);
        expect(LSS.data['cached'][0].length).toEqual(3);
      });
    });
    afterEach(function() {
      LSS.data = {};
    });
  });

  describe("sortable", function() {
    beforeEach(function() {
      LSS.tableData = data;
    });
    it("returns if data is null", function() {
      LSS.tableData = null;
      spyOn(LSS, 'renderView');
      LSS.sortable('query');
      expect(LSS.renderView).not.toHaveBeenCalled();
    });
    it("returns if data doesn't have property", function() {
      spyOn(LSS, 'renderView');
      LSS.sortable('unknown');
      expect(LSS.renderView).not.toHaveBeenCalled();
    });
    it("sorts data by property using _.sortBy()", function() {
      spyOn(LSS, 'renderView');
      LSS.sortable('ref_id');
      expect(LSS.renderView).toHaveBeenCalled();
      expect(LSS.sortDir).toEqual('desc');
    });
    it("sorts data by property using _.sortBy() with pased dataType", function() {
      // Spy on top level function parseFloat();
      var parseFloat = jasmine.createSpy();
      spyOn(LSS, 'renderView');
      LSS.sortable('evalue', parseFloat);
      expect(parseFloat).toHaveBeenCalled();
      expect(parseFloat.callCount).toEqual(4);
      expect(LSS.renderView).toHaveBeenCalled();
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
    it("gathers checked data when passed data is null", function() {
      spyOn(LSS, 'checkedAlgos').andReturn(['foo']);
      spyOn(LSS, 'gatherCheckedData');
      spyOn(_, 'template');
      LSS.renderTable(null);
      expect(LSS.gatherCheckedData).toHaveBeenCalledWith(['foo']);
      expect(_.template).toHaveBeenCalled();
    });
    it("uses cached data if set and passed data is null", function() {
      LSS.data['cached'] = LSS.data['foo']; // Set cached data.
      spyOn(LSS, 'checkedAlgos').andReturn(['foo']);
      spyOn(LSS, 'gatherCheckedData');
      spyOn(_, 'template');
      LSS.renderTable(null);
      expect(LSS.gatherCheckedData).not.toHaveBeenCalled();
      expect(_.template).toHaveBeenCalled();
    });
    it("uses passed data when not null", function() {
      spyOn(LSS, 'checkedAlgos').andReturn(['foo']);
      spyOn(LSS, 'gatherCheckedData');
      spyOn(_, 'template');
      LSS.renderTable(LSS.data['foo']);
      expect(LSS.gatherCheckedData).not.toHaveBeenCalled();
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
    });
    it("gathers checked data when passed data is null", function() {
      spyOn(LSS, 'checkedAlgos').andReturn(['foo']);
      spyOn(LSS, 'gatherCheckedData');
      spyOn(LSS, 'formatResults').andReturn([]);
      LSS.renderPartition(null);
      expect(LSS.gatherCheckedData).toHaveBeenCalledWith(['foo']);
      expect(LSS.formatResults).toHaveBeenCalled();
    });
    it("uses cached data if set and passed data is null", function() {
      LSS.data['cached'] = LSS.data['foo']; // Set cached data.
      spyOn(LSS, 'checkedAlgos').andReturn(['foo']);
      spyOn(LSS, 'gatherCheckedData');
      spyOn(LSS, 'formatResults').andReturn([]);
      LSS.renderPartition(null);
      expect(LSS.gatherCheckedData).not.toHaveBeenCalled();
      expect(LSS.formatResults).toHaveBeenCalled();
    });
    it("uses passed data when not null", function() {
      spyOn(LSS, 'checkedAlgos').andReturn(['foo']);
      spyOn(LSS, 'gatherCheckedData');
      spyOn(LSS, 'formatResults').andReturn([]);
      LSS.renderPartition(LSS.data['foo']);
      expect(LSS.gatherCheckedData).not.toHaveBeenCalled();
      expect(LSS.formatResults).toHaveBeenCalled();
    });
    afterEach(function() {
      LSS.data = {};
      LSS.tableData = {};
    });
  });
});
