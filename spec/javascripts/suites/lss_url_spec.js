describe("LSS URLs", function() {

  var data = getJSONFixture('blast_results.json');

  describe("formatLinkouts", function() {
    it("returns an array of objects containing urls and names", function() {
      spyOn(LSS, 'addGbrowseLinkouts');
      var links = LSS.formatLinkouts(data[0]);
      expect(LSS.addGbrowseLinkouts).toHaveBeenCalledWith(data[0]);
      expect(_.isArray(links)).toBeTruthy();
    });
  });

  describe("addGbrowseLinkouts via formatLinkouts", function() {
    it("formats gm_ linkout", function() {
      spyOn(LSS, 'addGm');
      var links = LSS.formatLinkouts(data[1]);
      expect(LSS.addGm).toHaveBeenCalledWith(data[1]);
      expect(_.isArray(links)).toBeTruthy();
    });
    it("formats mt_ linkout", function() {
      spyOn(LSS, 'addMt');
      var links = LSS.formatLinkouts(data[2]);
      expect(LSS.addMt).toHaveBeenCalledWith(data[2]);
      expect(_.isArray(links)).toBeTruthy();
    });
    it("formats lj_ linkout", function() {
      spyOn(LSS, 'addLj');
      var links = LSS.formatLinkouts(data[0]);
      expect(LSS.addLj).toHaveBeenCalledWith(data[0]);
      expect(_.isArray(links)).toBeTruthy();
    });
    it("formats cc_ linkout", function() {
      spyOn(LSS, 'addCc');
      var links = LSS.formatLinkouts(data[3]);
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
        var fake = {
          hit_display_id: "foo:bar",
          ref: "foo",
          ref_id: "bar",
          hit_from: 100,
          hit_to: 101,
          query: "q"
        },
        url = LSS.formatGbrowseUrl(fake, LSS.gbrowseUrls.gm_soybase);
        expect(url).toMatch('start=1;stop=50101');
      });
      it("where start > stop and start < interval (50000)", function() {
        var fake = {
          hit_display_id: "foo:bar",
          ref: "foo",
          ref_id: "bar",
          hit_from: 101,
          hit_to: 100,
          query: "q"
        },
        url = LSS.formatGbrowseUrl(fake, LSS.gbrowseUrls.gm_soybase);
        expect(url).toMatch('start=1;stop=50101');
      });
      it("where start < stop and start > interval (50000)", function() {
        var fake = {
          hit_display_id: "foo:bar",
          ref: "foo",
          ref_id: "bar",
          hit_from: 60000,
          hit_to: 60001,
          query: "q"
        },
        url = LSS.formatGbrowseUrl(fake, LSS.gbrowseUrls.gm_soybase);
        expect(url).toMatch('start=10000;stop=110001');
      });
      it("where start > stop and start > interval (50000)", function() {
        var fake = {
          hit_display_id: "foo:bar",
          ref: "foo",
          ref_id: "bar",
          hit_from: 60001,
          hit_to: 60000,
          query: "q"
        },
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
        ref_id: "12345"
      };
      var url = LSS.formatGbrowseUrl(gf, LSS.gbrowseUrls.gf_lis, "gene_family-lis");
      expect(url).not.toMatch('%');
      expect(url).toEqual('http://leggle.comparative-legumes.org/gene_families/name=' + gf.ref_id);
    });
    it("formats gbrowse url for hit to proteome", function() {
      var prot = {
        hit_display_id: "foo_proteome_bar:1212",
        ref: "foo_proteome_bar",
        ref_id: "1212"
      };
      var url = LSS.formatGbrowseUrl(prot, "http://google.com?foo=bar&baz=bam", "soybase");
      expect(url).toEqual('http://google.com?name=1212');
    });
  });

});
