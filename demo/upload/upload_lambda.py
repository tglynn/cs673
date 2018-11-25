#!/usr/bin/env python

import json
import logging
import os
import boto3

loglevel = os.environ.get('LOGLEVEL', 'INFO').upper()
logger = logging.getLogger()
logger.setLevel(loglevel)

def get_required_vars():
    """ Required environment variables:
     BUCKET - destination S3 bucket name
     SEARCH - dynamodb table name
     REGION - region containing dynamodb table
    """
    bucket = os.environ.get('BUCKET', 'cs673-projects-folder')
    search = os.environ.get('SEARCH', 'project_search')
    region = os.environ.get('REGION', 'us-east-2')
    logger.debug(
        "Environment variables set: bucket: {}, search: {}, region: {}".format(
        bucket, search, region)
    )
    return bucket, search, region
                 

def lambda_handler(event, context):
    bucket, search, region = get_required_vars()
    s3 = boto3.resource('s3', region_name = region)
    dynamodb = boto3.resource('dynamodb', region_name=region)
    table = dynamodb.Table(search)

    upload_response = upload_file(s3,
                                  bucket,
                                  event['content-location'],
                                  event['content']['body'],
                                  event['content-type'],
                                  # Get encoding if included. Default
                                  # to utf-8
                                  event['content'].get(
                                      'encoding','utf-8'))

    tag_response = commit_search_tags(table,
                       event['content']['tag_data'])

    if log_clean_results(upload_response, tag_response):
        return "Project uploaded and tagged"
    else:
        return "Error uploading and tagging project"


def upload_file(s3, bucket, path, file_content, content_type, content_encoding):
    """ Uploads a file $file_content of type $content_type and encoding 
    $content_encoding to s3, to the bucket set by $bucket, 
    using $path as the destination path"""
    # Remove the leading '/' from the path
    if path[0] == '/':
        path = path[1:]
    object = s3.Object(bucket, path)
    response = object.put(Body=file_content,
                          ContentEncoding=content_encoding,
                          ContentType=content_type)
    return reponse
    
def commit_search_tags(table, tag_data):
    """ Updates dynamodb search table with project tags """
    results = []
    for term in tag_data['terms']:
        results.append(
            table.update_item(
                Key = {
                    'search_term': term
                },
                UpdateExpression = "ADD project_name :p",
                ExpressionAttributeValues= {
                    # Convert identifier to `set` to prevent duplication
                    ':p' : {tag_data['Identifier'][0]},
                },
                ReturnValues="UPDATED_NEW"
            )
        )
    return results
                
    
def log_clean_results(upload_response, tag_response):
    results_clean = True
    if upload_response['ResponseMetadata']['HTTPStatusCode'] == 200:
        logger.info("File uploaded to S3") 

    for response in tag_response:
        if response['ResponseMetadata']['HTTPStatusCode'] != 200:
            logger.warn(
                "DynamoDB request id {} received a non 200 response: {}".format(
                    response['ResponseMetadata']['RequestId'],
                    response['ResponseMetadata']['HTTPStatusCode']
                    )
            )
            results_clean = False
        else:
            logger.debug("Tag {} committed with id {}".format(
                response['Attributes'],
                response['ResponseMetadata']['RequestId']
                )
            )
    return results_clean
            
    
