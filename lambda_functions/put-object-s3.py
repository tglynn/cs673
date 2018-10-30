import json
import urllib.parse
import boto3
import os

print('Loading function')

s3 = boto3.resource('s3')

def lambda_handler(event, context):
    print("Received event: " + json.dumps(event, indent=2))
    # request = json.loads(event)
    
    # Get the object from the event and show its content type
    bucket = 'cs673-projects-folder'
    key = event['content-location']
    file = event['content']
    try:
        s3.Object(bucket,key).put(Body=file)
        return bucket + '/' + key
    except Exception as e:
        print(e)
        print('Error writing object {} from bucket {}. Make sure they exist and your bucket is in the same region as this function.'.format(key, bucket))
        raise e
