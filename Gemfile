source 'https://rubygems.org'

gem 'rails', '3.2.8'
gem 'mysql2'

group :assets do
  gem 'sass-rails',   '~> 3.2.3'
  gem 'coffee-rails', '~> 3.2.1'
  gem 'therubyracer', :platforms => :ruby
  gem 'uglifier', '>= 1.0.3'
end

gem 'jquery-rails'
gem 'quorum', :git => 'https://github.com/ncgr/quorum.git', :branch => 'data_export'

group :development do
  gem 'debugger'
  gem 'thin'
end

group :test, :development do
  gem 'jasmine'
  gem 'jasmine-rails'
  gem 'jasmine-headless-webkit', '~> 0.9.0.rc.2'
  gem 'guard-jasmine-headless-webkit'
end
