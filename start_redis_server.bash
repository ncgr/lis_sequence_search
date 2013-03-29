#!/bin/bash -e

# note: the medplants site is not part of LIS, but it shares a redis
# server with search.comparative-legumes.org (because of the Quorum
# gem). only one of either medplants or LIS search should start the
# redis server from init scripts. --agr 2013-03

WORKERS=$1

if [[ ! $WORKERS =~ [[:digit:]] ]]; then
    echo "Number of resque workers not provided. Starting 4..."
    WORKERS=4
fi

# Start redis server
redis-server ./db/redis.conf &
echo $! > ./tmp/pids/redis.pid

if [ -e ./tmp/pids/resque.pid ]
then
    rm ./tmp/pids/resque.pid
fi

# Start resque workers
for n in $(seq 1 $WORKERS)
do
    bundle exec rake environment resque:work RAILS_ENV=development QUEUE=system_queue &
    echo $! >> ./tmp/pids/resque.pid
done

