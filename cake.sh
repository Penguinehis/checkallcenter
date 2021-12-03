#!/bin/bash
expire2=$1
expire="$(chage -l $expire2| grep -E "Account expires" | cut -d ' ' -f3-)"

if [ -z "$expire" ]; then
echo "not exist"
elif [ "$expire" = "never" ]; then
echo "never"
else
date -d "$expire" +"%Y%m%d"
fi


