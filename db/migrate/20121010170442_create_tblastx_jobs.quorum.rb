# This migration comes from quorum (originally 20121008200004)
class CreateTblastxJobs < ActiveRecord::Migration
  def change
    create_table :quorum_tblastx_jobs do |t|
      t.string :expectation
      t.integer :max_target_seqs
      t.integer :min_bit_score
      t.boolean :filter
      t.boolean :gapped_alignments
      t.integer :gap_opening_penalty
      t.integer :gap_extension_penalty
      t.text :blast_dbs
      t.boolean :queue

      t.references :job

      t.timestamps
    end
  end
end
