import json
import urllib.parse
import boto3
import os

print('Loading function')

s3 = boto3.resource('s3')

def lambda_handler(event, context):
    print("Received event: " + json.dumps(event, indent=2))
    # storage bucket
    bucket = 'cs673-projects-folder'
    # get path of POST file
    path = event['content-location']
    # get filename from path
    key = path[path.rfind('/')+1:]
    # get base64 binary stream of file
    file = event['content']['body']
    
    try:
        # put file in bucket
        s3.Object(bucket,key).put(Body=file)
        # return path to new file
        return bucket + '/' + key
    except Exception as e:
        print(e)
        print('Error writing object {} from bucket {}. Make sure they exist and your bucket is in the same region as this function.'.format(key, bucket))
        raise e
