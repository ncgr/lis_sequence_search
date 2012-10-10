describe("SEQUENCES", function() {

  beforeEach(function() {
    loadFixtures('form.html');
  });

  describe("addSequences", function() {

    it("adds cdna sequences", function() {
      SEQUENCES.addSequences("cdna");

      expect($("#job_sequence")).not.toHaveClass("auto-hint");
      expect($("#job_sequence").val()).toEqual(SEQUENCES.cdna);

      expect($("#job_blastn_job_attributes_queue")).toBeChecked();
      $("#job_blastn_job_attributes_blast_dbs option").each(function() {
        expect($(this)).toBeSelected();
      });

      expect($("#job_blastx_job_attributes_queue")).toBeChecked();
      $("#job_blastx_job_attributes_blast_dbs option").each(function() {
        expect($(this)).toBeSelected();
      });

      expect($("#job_tblastx_job_attributes_queue")).toBeChecked();
      $("#job_tblastx_job_attributes_blast_dbs option").each(function() {
        expect($(this)).toBeSelected();
      });

      expect($("#job_tblastn_job_attributes_queue")).not.toBeChecked();
      expect($("#job_blastp_job_attributes_queue")).not.toBeChecked();
    });

    it("adds cdna sequences to special case", function() {
      SEQUENCES.addSpecialClass();
      SEQUENCES.addSequences("cdna");

      expect($("#job_sequence")).not.toHaveClass("auto-hint");
      expect($("#job_sequence").val()).toEqual(SEQUENCES.cdna);

      // Nothing else in the form should be touched in this case.
      expect($("#job_blastn_job_attributes_queue")).not.toBeChecked();
      expect($("#job_blastx_job_attributes_queue")).not.toBeChecked();
      expect($("#job_tblastn_job_attributes_queue")).not.toBeChecked();
      expect($("#job_blastp_job_attributes_queue")).not.toBeChecked();
      expect($("#job_tblastx_job_attributes_queue")).not.toBeChecked();
    });

    it("adds peptide sequences", function() {
      SEQUENCES.addSequences("prot");

      expect($("#job_sequence")).not.toHaveClass("auto-hint");
      expect($("#job_sequence").val()).toEqual(SEQUENCES.prot);

      expect($("#job_tblastn_job_attributes_queue")).toBeChecked();
      $("#job_tblastn_job_attributes_blast_dbs option").each(function() {
        expect($(this)).toBeSelected();
      });

      expect($("#job_blastp_job_attributes_queue")).toBeChecked();
      $("#job_blastp_job_attributes_blast_dbs option").each(function() {
        expect($(this)).toBeSelected();
      });

      expect($("#job_blastn_job_attributes_queue")).not.toBeChecked();
      expect($("#job_blastx_job_attributes_queue")).not.toBeChecked();
      expect($("#job_tblastx_job_attributes_queue")).not.toBeChecked();
    });

    it("adds peptide sequences to special case", function() {
      SEQUENCES.addSpecialClass();
      SEQUENCES.addSequences("prot");

      expect($("#job_sequence")).not.toHaveClass("auto-hint");
      expect($("#job_sequence").val()).toEqual(SEQUENCES.prot);

      // Nothing else in the form should be touched in this case.
      expect($("#job_blastn_job_attributes_queue")).not.toBeChecked();
      expect($("#job_blastx_job_attributes_queue")).not.toBeChecked();
      expect($("#job_tblastn_job_attributes_queue")).not.toBeChecked();
      expect($("#job_blastp_job_attributes_queue")).not.toBeChecked();
      expect($("#job_tblastx_job_attributes_queue")).not.toBeChecked();
    });

    it("adds mixed sequences", function() {
      SEQUENCES.addSequences("mixed");

      expect($("#job_sequence")).not.toHaveClass("auto-hint");
      expect($("#job_sequence").val()).toEqual(SEQUENCES.mixed);

      expect($("#job_blastn_job_attributes_queue")).toBeChecked();
      $("#job_tblastn_job_attributes_blast_dbs option").each(function() {
        expect($(this)).toBeSelected();
      });

      expect($("#job_blastx_job_attributes_queue")).toBeChecked();
      $("#job_blastp_job_attributes_blast_dbs option").each(function() {
        expect($(this)).toBeSelected();
      });

      expect($("#job_tblastn_job_attributes_queue")).toBeChecked();
      $("#job_tblastn_job_attributes_blast_dbs option").each(function() {
        expect($(this)).toBeSelected();
      });

      expect($("#job_blastp_job_attributes_queue")).toBeChecked();
      $("#job_blastp_job_attributes_blast_dbs option").each(function() {
        expect($(this)).toBeSelected();
      });

      expect($("#job_tblastx_job_attributes_queue")).toBeChecked();
      $("#job_tblastx_job_attributes_blast_dbs option").each(function() {
        expect($(this)).toBeSelected();
      });

    });

    it("adds mixed sequences to special case", function() {
      SEQUENCES.addSpecialClass();
      SEQUENCES.addSequences("mixed");

      expect($("#job_sequence")).not.toHaveClass("auto-hint");
      expect($("#job_sequence").val()).toEqual(SEQUENCES.mixed);

      // Nothing else in the form should be touched in this case.
      expect($("#job_blastn_job_attributes_queue")).not.toBeChecked();
      expect($("#job_blastx_job_attributes_queue")).not.toBeChecked();
      expect($("#job_tblastn_job_attributes_queue")).not.toBeChecked();
      expect($("#job_blastp_job_attributes_queue")).not.toBeChecked();
      expect($("#job_tblastx_job_attributes_queue")).not.toBeChecked();
    });

  });

  describe("setGenomeSearch", function() {

    it("enables blastn and tblastn for all species genome targets", function() {
      SEQUENCES.setGenomeSearch();

      expect($("#job_blastx_job_attributes_queue").parent()).not.toBeVisible();
      expect($("#job_blastp_job_attributes_queue").parent()).not.toBeVisible();

      expect($("#job_blastn_job_attributes_queue")).toBeChecked();
      $("#job_blastn_job_attributes_blast_dbs option").each(function() {
        expect($(this).val()).toMatch("genome");
        expect($(this)).toBeSelected();
      });

      expect($("#job_tblastn_job_attributes_queue")).toBeChecked();
      $("#job_tblastn_job_attributes_blast_dbs option").each(function() {
        expect($(this).val()).toMatch("genome");
        expect($(this)).toBeSelected();
      });

      expect($("#job_tblastx_job_attributes_queue")).toBeChecked();
      $("#job_tblastx_job_attributes_blast_dbs option").each(function() {
        expect($(this).val()).toMatch("genome");
        expect($(this)).toBeSelected();
      });

    });

  });

  describe("setGeneSearch", function() {

    it("enables blastn, blastx, tblastn and blastp for all species proteome, gene model and family targets", function() {
      SEQUENCES.setGeneSearch();

      expect($("#job_blastn_job_attributes_queue")).toBeChecked();
      $("#job_blastn_job_attributes_blast_dbs option").each(function() {
        expect($(this).val()).toMatch("genemodel");
        expect($(this)).toBeSelected();
      });

      expect($("#job_blastx_job_attributes_queue")).toBeChecked();
      $("#job_blastx_job_attributes_blast_dbs option").each(function() {
        expect($(this).val()).toMatch(/proteome|gene_families/);
        expect($(this)).toBeSelected();
      });

      expect($("#job_tblastn_job_attributes_queue")).toBeChecked();
      $("#job_tblastn_job_attributes_blast_dbs option").each(function() {
        expect($(this).val()).toMatch("genemodel");
        expect($(this)).toBeSelected();
      });

      expect($("#job_blastp_job_attributes_queue")).toBeChecked();
      $("#job_blastp_job_attributes_blast_dbs option").each(function() {
        expect($(this).val()).toMatch(/proteome|gene_families/);
        expect($(this)).toBeSelected();
      });

      expect($("#job_tblastx_job_attributes_queue")).toBeChecked();
      $("#job_tblastx_job_attributes_blast_dbs option").each(function() {
        expect($(this).val()).toMatch("genemodel");
        expect($(this)).toBeSelected();
      });

    });

  });

  describe("add and remove special class", function() {

    it("adds the class 'special' to example sequence links", function() {
      SEQUENCES.addSpecialClass();
      $('#example-sequences a').each(function() {
        expect($(this).hasClass('special')).toBeTruthy();
      });
    });

    it("removes the class 'special' to example sequence links", function() {
      SEQUENCES.addSpecialClass();
      SEQUENCES.removeSpecialClass();
      $('#example-sequences a').each(function() {
        expect($(this).hasClass('special')).toBeFalsy();
      });
    });

  });

  describe("checkQuery", function() {

    it("calls addSpecialClass and setGenomeSearch when passed 'genome'", function() {
      spyOn(SEQUENCES, 'addSpecialClass');
      spyOn(SEQUENCES, 'setGenomeSearch');
      SEQUENCES.checkQuery('genome');
      expect(SEQUENCES.addSpecialClass).toHaveBeenCalled();
      expect(SEQUENCES.setGenomeSearch).toHaveBeenCalled();
    });

    it("calls addSpecialClass and setGeneSearch when passed 'gene'", function() {
      spyOn(SEQUENCES, 'addSpecialClass');
      spyOn(SEQUENCES, 'setGeneSearch');
      SEQUENCES.checkQuery('gene');
      expect(SEQUENCES.addSpecialClass).toHaveBeenCalled();
      expect(SEQUENCES.setGeneSearch).toHaveBeenCalled();
    });

    it("calls removeSpecialClass when passed an unrecognized param", function() {
      spyOn(SEQUENCES, 'removeSpecialClass');
      spyOn(SEQUENCES, 'setGenomeSearch');
      spyOn(SEQUENCES, 'setGeneSearch');
      SEQUENCES.checkQuery('foo');
      expect(SEQUENCES.removeSpecialClass).toHaveBeenCalled();
      expect(SEQUENCES.setGenomeSearch).not.toHaveBeenCalled();
      expect(SEQUENCES.setGeneSearch).not.toHaveBeenCalled();
    });

  });
});
