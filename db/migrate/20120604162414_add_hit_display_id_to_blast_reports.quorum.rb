# This migration comes from quorum (originally 20120109232446)
class AddHitDisplayIdToBlastReports < ActiveRecord::Migration
  def change
    add_column :quorum_blastn_job_reports, :hit_display_id, :string
    add_column :quorum_blastx_job_reports, :hit_display_id, :string
    add_column :quorum_tblastn_job_reports, :hit_display_id, :string
    add_column :quorum_blastp_job_reports, :hit_display_id, :string
  end
end
