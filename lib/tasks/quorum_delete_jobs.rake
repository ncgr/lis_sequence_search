#
# Remove jobs submitted > 1.week.ago
#

namespace :quorum do
  desc "Remove jobs submitted > 1.week.ago"
  task :delete_jobs => :environment do
    Quorum::Job.where("created_at >= #{1.week.ago.to_date}").delete_all
  end
end
