#!/bin/bash

# Get the file

echo "Getting file from S3"

curl -O https://s3.us-east-2.amazonaws.com/cs673-projects-folder/2018/Spring/Aurelius+CS633+OL+Spring+2018.pdf


echo "Starting file checksum is $(shasum -a 256 ./Aurelius+CS633+OL+Spring+2018.pdf)"

echo "Uploading, tagging and committing"

python ./post_to_apigateway_test.py

echo "Downloading the newly posted file"

curl -O https://s3.us-east-2.amazonaws.com/cs673-projects-folder/2018/Spring/Aurelius+CS633+OL+Spring+2018.pdf


echo "Final file checksum is $(shasum -a 256 ./Aurelius+CS633+OL+Spring+2018.pdf)"

