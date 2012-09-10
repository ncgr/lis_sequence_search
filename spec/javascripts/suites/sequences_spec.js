describe("SEQUENCES", function() {

  describe("addSequences", function() {

    beforeEach(function() {
      loadFixtures('form.html');
    });

    it("adds cdna sequences", function() {
      SEQUENCES.addSequences("cdna");

      expect($("#job_sequence")).not.toHaveClass("auto-hint");

      expect($("#job_blastn_job_attributes_queue")).toBeChecked();
      $("#job_blastn_job_attributes_blast_dbs option").each(function() {
        expect($(this)).toBeSelected();
      });

      expect($("#job_blastx_job_attributes_queue")).toBeChecked();
      $("#job_blastx_job_attributes_blast_dbs option").each(function() {
        expect($(this)).toBeSelected();
      });

      expect($("#job_tblastn_job_attributes_queue")).not.toBeChecked();
      expect($("#job_blastp_job_attributes_queue")).not.toBeChecked();
    });


    it("adds peptide sequences", function() {
      SEQUENCES.addSequences("prot");

      expect($("#job_sequence")).not.toHaveClass("auto-hint");

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
    });

    it("adds mixed sequences", function() {
      SEQUENCES.addSequences("mixed");

      expect($("#job_sequence")).not.toHaveClass("auto-hint");

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
    });

  });

});
