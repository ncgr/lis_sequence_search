# This migration comes from quorum (originally 20121010172558)
class AddPercentIdentityAndMismatchToTblastx < ActiveRecord::Migration
  def change
    add_column :quorum_tblastx_job_reports, :pct_identity, :float
    add_column :quorum_tblastx_job_reports, :mismatch, :integer
  end
end
