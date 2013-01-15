#!/usr/bin/env rake
# Add your own tasks in files placed in lib/tasks ending in .rake,
# for example lib/tasks/capistrano.rake, and they will automatically be available to Rake.

require File.expand_path('../config/application', __FILE__)

LisSequenceSearch::Application.load_tasks

task :default => :'jasmine:ci'

# Travis Tasks
namespace :travis do

  task :install do
    Rake::Task["travis:create_db_config"].execute
    Rake::Task["travis:quorum_settings"].execute
    Rake::Task["travis:db_migrate"].execute
  end

  task :spec do
    Rake::Task["travis:install"].execute
    ["rake jasmine:ci JASMINE_PORT=53331"].each do |cmd|
      puts "Starting to run #{cmd}..."
      system("export DISPLAY=:99.0 && bundle exec #{cmd}")
      raise "#{cmd} failed!" unless $?.exitstatus == 0
    end
    Rake::Task["travis:remove_db_config"].execute
  end

  task :db_migrate => :environment do
    puts "Migrating the database..."
    cmds = [
      "rake quorum:install:migrations",
      "rake db:migrate",
      "rake db:test:prepare"
    ]
    cmds.each do |cmd|
      system("bundle exec #{cmd}")
      raise "#{cmd} failed!" unless $?.exitstatus == 0
    end

  end

  task :quorum_settings => :environment do
    puts "Installing quorum_settings..."
    settings = File.expand_path("../spec/config/quorum_settings.yml", __FILE__)
    config = File.expand_path("../config", __FILE__)
    FileUtils.cp settings, config
  end

  task :create_db_config do
    config = File.expand_path("../config", __FILE__)
    File.open(File.join(config, "database.yml"), "w+") do |file|
      file.puts "\nmysql: &mysql\n  adapter: mysql2\n" <<
      "  database: lis_sequence_search_test\n  username: root\n"
      file.puts "\npostgresql: &postgresql\n  adapter: postgresql\n" <<
      "  database: lis_sequence_search_test\n  username: postgres\n" <<
      "  min_messages: ERROR\n"
      file.puts "\ndefaults: &defaults\n  pool: 5\n" <<
      "  timeout: 5000\n  host: localhost\n" <<
      "  <<: *<%= ENV['DB'] %>\n"
      file.puts "\ntest:\n  <<: *defaults"
    end
  end

  task :remove_db_config do
    config = File.expand_path("../config", __FILE__)
    if File.exists?(File.join(config, "database.yml"))
      FileUtils.rm File.join(config, "database.yml")
    end
  end

end
