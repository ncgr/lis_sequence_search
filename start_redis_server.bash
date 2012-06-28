#!/bin/bash

WORKERS=$1

if [[ ! $WORKERS =~ [[:digit:]] ]]; then
    echo "Error: please enter the number of resque workers."
    exit 1
fi

# Start redis server
redis-server ./db/redis.conf &
echo $! > ./tmp/pids/redis.pid

if [ -e ./tmp/pids/resque.pid ]
then
    rm ./tmp/pids/resque.pid
fi

# Start resque workers
for n in $(seq 1 $1)
do
    bundle exec rake environment resque:work RAILS_ENV=development QUEUE=system_queue &
    echo $! >> ./tmp/pids/resque.pid
done

