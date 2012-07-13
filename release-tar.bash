#!/bin/bash

#
# Creates a tarball ready to deploy.
#
tar -czf lis_sequence_search-release.tar.gz \
    lis_sequence_search/app \
    lis_sequence_search/config \
    lis_sequence_search/config.ru \
    lis_sequence_search/db/migrate \
    lis_sequence_search/db/redis.conf \
    lis_sequence_search/db/schema.rb \
    lis_sequence_search/db/seeds.rb \
    lis_sequence_search/doc \
    lis_sequence_search/Gemfile \
    lis_sequence_search/Gemfile.lock \
    lis_sequence_search/lib \
    lis_sequence_search/public \
    lis_sequence_search/Rakefile \
    lis_sequence_search/README.rdoc \
    lis_sequence_search/script \
    lis_sequence_search/start_redis_server.bash \
    lis_sequence_search/vendor

