#!/usr/bin/env python

import json
import logging
import os
import boto3
import base64

loglevel = os.environ.get('LOGLEVEL', 'INFO').upper()
logger = logging.getLogger()
logger.setLevel(loglevel)

def get_required_vars():
    """ Required environment variables:
     BUCKET - destination S3 bucket name
     SEARCH - search tags dynamodb table name
     DETAILS - project details dynamodb table name
     REGION - region containing dynamodb table
    """
    bucket = os.environ.get('BUCKET', 'cs673-projects-folder')
    search = os.environ.get('SEARCH', 'project_search')
    details = os.environ.get('DETAILS', 'project_details')
    region = os.environ.get('REGION', 'us-east-2')
    logger.debug(
        "Environment variables set: bucket: {}, search: {}, details: {}, region: {}".format(
        bucket, search, details, region)
    )
    return bucket, search, details, region
                 

def lambda_handler(event, context):
    bucket, search, details, region = get_required_vars()
    s3 = boto3.resource('s3', region_name = region)
    dynamodb = boto3.resource('dynamodb', region_name=region)
    search_table = dynamodb.Table(search)
    details_table = dynamodb.Table(details)

    #Extract the useful request from the API gateway call
    r = event.get('body', None)
    if r:
        r = json.loads(r)
    else:
        return {
            "statusCode": 400,
            "body": "Bad or missing request"
            }


    upload_response = upload_file(s3,
                                  bucket,
                                  r['content-location'],
                                  r['content']['encoded_file'],
                                  r['content-type'],
                                  # Get encoding if included. Default
                                  # to utf-8
                                  r['content'].get(
                                      'encoding','utf-8'))

    tag_response = commit_search_tags(search_table,
                       r['content']['tag_data'])

    detail_response = commit_details(details_table,
    					r['details'])

    if log_clean_results(upload_response, tag_response):
        return {
            "statusCode": 200,
            "body": "Project uploaded and tagged"
            }
    else:
        return {
            "statusCode": 502,
            "body": "Error uploading and tagging project"
            }

def upload_file(s3, bucket, path, file_content, content_type, content_encoding):
    """ Uploads a file $file_content of type $content_type and encoding 
    $content_encoding to s3, to the bucket set by $bucket, 
    using $path as the destination path"""
    # Remove the leading '/' from the path
    if path[0] == '/':
        path = path[1:]
    object = s3.Object(bucket, path)
    #Decode content string
    if content_encoding == 'base64':
        file_content = base64.b64decode(file_content)
    response = object.put(Body=file_content,
                          ContentEncoding=content_encoding,
                          ContentType=content_type)
    return response
    
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

def commit_details(table, details):
	""" Updates dynamodb details table with detailed information """
	results = []
	
	results.append(
		table.put_item(
			Item={
				'project_path': details['Identifier'],
				'project_name': details['project_name'],
				'year': details['year'],
				'semester': details['semester'],
				'instructor': details['instructor'],
				'github': details['github'],
				'description': details['description'],
                'pivotal_tracker': details['pivotal_tracker'],
                'website': details['website'],
                'team_members': details['team_members']
			}
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
            
    
