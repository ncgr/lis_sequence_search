#!/bin/bash

# Start redis server
redis-server ./db/redis.conf &
echo $! > ./tmp/pids/redis.pid

if [ -e ./tmp/pids/resque.pid ]
then
    rm ./tmp/pids/resque.pid
fi

# Start resque workers
for n in 1
do
    bundle exec rake environment resque:work RAILS_ENV=development QUEUE=system_queue &
    echo $! >> ./tmp/pids/resque.pid
done

