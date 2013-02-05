describe("LSS URLs", function() {

  describe("formatLinkouts", function() {
    it("returns an array of objects containing urls and names", function() {
      spyOn(LSS, 'addGbrowseLinkouts');
      var fake = {
            hit_display_id: "foo:bar",
            ref: "foo",
            ref_id: "bar"
          },
          links = LSS.formatLinkouts(fake);
      expect(LSS.addGbrowseLinkouts).toHaveBeenCalledWith(fake);
      expect(_.isArray(links)).toBeTruthy();
    });
  });

  describe("addGbrowseLinkouts via formatLinkouts", function() {
    it("formats glyma_ linkout", function() {
      spyOn(LSS, 'addGlyma');
      var fake = {
            hit_display_id: "glyma_foo:bar",
            ref: "glyma_foo",
            ref_id: "bar"
          },
          links = LSS.formatLinkouts(fake);
      expect(LSS.addGlyma).toHaveBeenCalledWith(fake);
      expect(_.isArray(links)).toBeTruthy();
    });
    it("formats medtr_ linkout", function() {
      spyOn(LSS, 'addMedtr');
      var fake = {
            hit_display_id: "medtr_foo:bar",
            ref: "medtr_foo",
            ref_id: "bar"
          },
          links = LSS.formatLinkouts(fake);
      expect(LSS.addMedtr).toHaveBeenCalledWith(fake);
      expect(_.isArray(links)).toBeTruthy();
    });
    it("formats lotja_ linkout", function() {
      spyOn(LSS, 'addLotja');
      var fake = {
            hit_display_id: "lotja_foo:bar",
            ref: "lotja_foo",
            ref_id: "bar"
          },
          links = LSS.formatLinkouts(fake);
      expect(LSS.addLotja).toHaveBeenCalledWith(fake);
      expect(_.isArray(links)).toBeTruthy();
    });
    it("formats cajca_ linkout", function() {
      spyOn(LSS, 'addCajca');
      var fake = {
            hit_display_id: "cajca_foo:bar",
            ref: "cajca_foo",
            ref_id: "bar"
          },
          links = LSS.formatLinkouts(fake);
      expect(LSS.addCajca).toHaveBeenCalledWith(fake);
      expect(_.isArray(links)).toBeTruthy();
    });
    it("formats cicar_ linkout", function() {
      spyOn(LSS, 'addCicar');
      var fake = {
            hit_display_id: "cicar_foo:bar",
            ref: "cicar_foo",
            ref_id: "bar"
          },
          links = LSS.formatLinkouts(fake);
      expect(LSS.addCicar).toHaveBeenCalledWith(fake);
      expect(_.isArray(links)).toBeTruthy();
    });
    it("formats phavu_ linkout", function() {
      spyOn(LSS, 'addPhavu');
      var fake = {
            hit_display_id: "phavu_foo:bar",
            ref: "phavu_foo",
            ref_id: "bar"
          },
          links = LSS.formatLinkouts(fake);
      expect(LSS.addPhavu).toHaveBeenCalledWith(fake);
      expect(_.isArray(links)).toBeTruthy();
    });
    it("formats genefam linkout", function() {
      spyOn(LSS, 'addGenfam');
      var fake = {
            hit_display_id: "genefam_foo:bar",
            ref: "genefam_foo",
            ref_id: "bar"
          },
          links = LSS.formatLinkouts(fake);
      expect(LSS.addGenfam).toHaveBeenCalledWith(fake);
      expect(_.isArray(links)).toBeTruthy();
    });
  });

  describe("addGlyma", function() {
    it("formats a url for Soybase", function() {
      spyOn(LSS, 'formatGbrowseUrl');
      var fake = {
            hit_display_id: "glyma_foo:bar",
            ref: "glyma_foo",
            ref_id: "bar"
          },
          url = LSS.addGlyma(fake);
      expect(url[0].name).toEqual("Glycine max - Soybase");
      expect(LSS.formatGbrowseUrl).toHaveBeenCalledWith(
        fake,
        LSS.gbrowseUrls.glyma_soybase,
        "soybase"
      );
    });
  });

  describe("addMedtr", function() {
    var fake = {
          hit_display_id: "medtr_foo:bar",
          ref: "medtr_foo",
          ref_id: "bar"
        };
    it("formats a url for JCVI", function() {
      spyOn(LSS, 'formatGbrowseUrl');
      var url = LSS.addMedtr(fake);
      expect(url[0].name).toEqual("Medicago truncatula - JCVI");
      expect(LSS.formatGbrowseUrl).toHaveBeenCalledWith(
        fake,
        LSS.gbrowseUrls.medtr_jcvi,
        "jcvi"
      );
    });
    it("formats a url for Hapmap", function() {
      spyOn(LSS, 'formatGbrowseUrl');
      var url = LSS.addMedtr(fake);
      expect(url[1].name).toEqual("Medicago truncatula - Hapmap");
      expect(LSS.formatGbrowseUrl).toHaveBeenCalledWith(
        fake,
        LSS.gbrowseUrls.medtr_hapmap,
        "hapmap"
      );
    });
    it("formats a url for LIS", function() {
      spyOn(LSS, 'formatGbrowseUrl');
      var url = LSS.addMedtr(fake);
      expect(url[2].name).toEqual("Medicago truncatula - LIS");
      expect(LSS.formatGbrowseUrl).toHaveBeenCalledWith(
        fake,
        LSS.gbrowseUrls.medtr_lis,
        "medtr-lis"
      );
    });
  });

  describe("addLotja", function() {
    it("formats a url for Kazusa", function() {
      spyOn(LSS, 'formatGbrowseUrl');
      var fake = {
            hit_display_id: "lotja_foo:bar",
            ref: "lotja_foo",
            ref_id: "bar"
          },
          url = LSS.addLotja(fake);
      expect(url[0].name).toEqual("Lotus japonicus - Kazusa");
      expect(LSS.formatGbrowseUrl).toHaveBeenCalledWith(
        fake,
        LSS.gbrowseUrls.lotja_kazusa,
        "kazusa"
      );
    });
  });

  describe("addCajca", function() {
    it("formats a url for Cajca LIS", function() {
      spyOn(LSS, 'formatGbrowseUrl');
      var fake = {
            hit_display_id: "cajca_foo:bar",
            ref: "cajca_foo",
            ref_id: "bar"
          },
          url = LSS.addCajca(fake);
      expect(url[0].name).toEqual("Cajanus cajan - LIS");
      expect(LSS.formatGbrowseUrl).toHaveBeenCalledWith(
        fake,
        LSS.gbrowseUrls.cajca_lis,
        "cajca-lis"
      );
    });
  });

  describe("addCicar", function() {
    it("formats a url for Cicar LIS", function() {
      spyOn(LSS, 'formatGbrowseUrl');
      var fake = {
            hit_display_id: "cicar_foo:bar",
            ref: "cicar_foo",
            ref_id: "bar"
          },
          url = LSS.addCicar(fake);
      expect(url[0].name).toEqual("Cicer arietinum - LIS");
      expect(LSS.formatGbrowseUrl).toHaveBeenCalledWith(
        fake,
        LSS.gbrowseUrls.cicar_lis,
        "cicar-lis"
      );
    });
  });


  describe("addPhavu", function() {
    it("formats a url for Phavu LIS", function() {
      spyOn(LSS, 'formatGbrowseUrl');
      var fake = {
            hit_display_id: "phavu_foo:bar",
            ref: "phavu_foo",
            ref_id: "bar"
          },
          url = LSS.addPhavu(fake);
      expect(url[0].name).toEqual("Phaseolus vulgaris - Phytozome");
      expect(LSS.formatGbrowseUrl).toHaveBeenCalledWith(
        fake,
        LSS.gbrowseUrls.phavu_phytozome
      );
    });
  });

  describe("addGenfam", function() {
    it("formats a url for Genefam LIS", function() {
      spyOn(LSS, 'formatGbrowseUrl');
      var gf = {
            hit_display_id: "genefam_20120817_protein:12345",
            ref: "genefam_20120817_protein",
            ref_id: 12345
          },
          url = LSS.addGenfam(gf);
      expect(url[0].name).toEqual("Gene family consensus - LIS");
      expect(LSS.formatGbrowseUrl).toHaveBeenCalledWith(
        gf,
        LSS.gbrowseUrls.genfam_lis,
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
        url = LSS.formatGbrowseUrl(fake, LSS.gbrowseUrls.glyma_soybase);
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
        url = LSS.formatGbrowseUrl(fake, LSS.gbrowseUrls.glyma_soybase);
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
        url = LSS.formatGbrowseUrl(fake, LSS.gbrowseUrls.glyma_soybase);
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
        url = LSS.formatGbrowseUrl(fake, LSS.gbrowseUrls.glyma_soybase);
        expect(url).toMatch('start=10000;stop=110001');
      });
    });

    it("formats gbrowse url for soybase", function() {
      var fake = {
            hit_display_id: "glyma_foo:chr1",
            ref: "glyma_foo",
            ref_id: "chr1",
            hit_from: 100,
            hit_to: 101,
            query: "q"
          },
          url = LSS.formatGbrowseUrl(fake, LSS.gbrowseUrls.glyma_soybase, "soybase");
      expect(url).not.toMatch('%');
      expect(url).toEqual('http://soybase.org/gb2/gbrowse/gmax1.01/?ref=chr1;start=1;stop=50101;version=100;cache=on;drag_and_drop=on;show_tooltips=on;grid=on;add=chr1+LIS+LIS_Query_q+100..101');
    });
    it("formats gbrowse url for jcvi", function() {
      var fake = {
            hit_display_id: "medtr_foo:chr1",
            ref: "medtr_foo",
            ref_id: "chr1",
            hit_from: 100,
            hit_to: 101,
            query: "q"
          },
          url = LSS.formatGbrowseUrl(fake, LSS.gbrowseUrls.medtr_jcvi, "jcvi");
      expect(url).not.toMatch('%');
      expect(url).toEqual('http://www.jcvi.org/cgi-bin/gb2/gbrowse/mtruncatula/?ref=chr1;start=1;stop=50101;width=1024;version=100;icache=on;drag_and_drop=on;show_tooltips=on;grid=on;label=Gene-Transcripts_all-Transcripts_Bud-Transcripts_Blade-Transcripts_Root-Transcripts_Flower-Transcripts_Seed-Transcripts_mtg-Gene_Models-mt_fgenesh-genemarkHMM-genscan-fgenesh-TC_poplar-TC_maize-TC_arabidopsis-TC_Lotus-TC_soybean-TC_cotton-TC_medicago-TC_rice-TC_sorghum;add=chr1+LIS+LIS_Query_q+100..101');
    });
    it("formats gbrowse url for medtr-lis", function() {
      var fake = {
            hit_display_id: "medtr_foo:chr1",
            ref: "medtr_foo",
            ref_id: "chr1",
            hit_from: 100,
            hit_to: 101,
            query: "q"
          },
          url = LSS.formatGbrowseUrl(fake, LSS.gbrowseUrls.medtr_lis, "medtr-lis");
      expect(url).not.toMatch('%');
      expect(url).toEqual('http://medtr.comparative-legumes.org/gb2/gbrowse/3.5.1/?ref=Mt1;start=1;stop=50101;width=1024;version=100;flip=0;grid=1;add=Mt1+LIS+LIS_Query_q+100..101');
    });
    it("formats gbrowse url for hapmap", function() {
      var fake = {
            hit_display_id: "medtr_foo:chr1",
            ref: "medtr_foo",
            ref_id: "chr1",
            hit_from: 100,
            hit_to: 101,
            query: "q"
          },
          url = LSS.formatGbrowseUrl(fake, LSS.gbrowseUrls.medtr_hapmap, "hapmap");
      expect(url).not.toMatch('%');
      expect(url).toEqual('http://www.medicagohapmap.org/cgi-bin/gbrowse/mthapmap/?q=chr1:1..50101;t=Genes+Transcript+ReadingFrame+Translation+SNP+SNP_HM005+CovU_HM005+SNP_HM006+CovU_HM006+SNP_HM029+CovU_HM029;c=1;add=chr1+LIS+LIS_Query_q+100..101');
    });
    it("formats gbrowse url for cajca-lis", function() {
      var fake = {
            hit_display_id: "cajca_foo:CcLG01",
            ref: "cajca_foo",
            ref_id: "CcLG01",
            hit_from: 100,
            hit_to: 101,
            query: "q"
          },
          url = LSS.formatGbrowseUrl(fake, LSS.gbrowseUrls.cajca_lis, "cajca-lis");
      expect(url).not.toMatch('%');
      expect(url).toEqual('http://cajca.comparative-legumes.org/gb2/gbrowse/Cc1.0/?ref=Cc01;start=1;stop=50101;width=1024;version=100;flip=0;grid=1;add=Cc01+LIS+LIS_Query_q+100..101');
    });
    it("formats gbrowse url for cicar-lis", function() {
      var fake = {
            hit_display_id: "cicar_foo:Ca01",
            ref: "cicar_foo",
            ref_id: "Ca01",
            hit_from: 100,
            hit_to: 101,
            query: "q"
          },
          url = LSS.formatGbrowseUrl(fake, LSS.gbrowseUrls.cicar_lis, "cicar-lis");
      expect(url).not.toMatch('%');
      expect(url).toEqual('http://cicar.comparative-legumes.org/gb2/gbrowse/Ca1.0/?ref=Ca1;start=1;stop=50101;width=1024;version=100;flip=0;grid=1;add=Ca1+LIS+LIS_Query_q+100..101');
    });
    // kazusa is the only url with valid %%s
    it("formats gbrowse url for kazusa", function() {
      var fake = {
            hit_display_id: "lotja_foo:chr1",
            ref: "lotja_foo",
            ref_id: "chr1",
            hit_from: 100,
            hit_to: 101,
            query: "q"
          },
          url = LSS.formatGbrowseUrl(fake, LSS.gbrowseUrls.lotja_kazusa);
      expect(url).toEqual('http://gsv.kazusa.or.jp/cgi-bin/gbrowse/lotus/?ref=chr1;start=1;stop=50101;width=1024;version=100;label=contig-phase3-phase1%%2C2-annotation-GMhmm-GenScan-blastn-tigrgi-blastx-marker;grid=on;add=chr1+LIS+LIS_Query_q+100..101');
    });
    it("formats gbrowse url for gene_family-lis", function() {
      var gf = {
        hit_display_id: "genefam_20120817_protein:12345",
        ref: "genefam_20120817_protein",
        ref_id: "12345"
      };
      var url = LSS.formatGbrowseUrl(gf, LSS.gbrowseUrls.genfam_lis, "gene_family-lis");
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
    it("formats gbrowse url for hit to kazusa proteome", function() {
      var prot = {
        hit_display_id: "foo_proteome_bar:1212",
        ref: "foo_proteome_bar",
        ref_id: "1212"
      };
      var url = LSS.formatGbrowseUrl(prot, "http://google.com?foo=bar&baz=bam", "kazusa");
      expect(url).toEqual('http://google.com?name=CDS:1212');
    });
    it("Ignores gbrowse urls for hits transcriptomes", function() {
      var trans = {
        hit_display_id: "foo_transcriptome_bar:1212",
        ref: "foo_transcriptome_bar",
        ref_id: "1212"
      };
      var url = LSS.formatGbrowseUrl(trans, "http://google.com?foo=bar&baz=bam", "kazusa");
      expect(url).toEqual('');
    });
  });

});
