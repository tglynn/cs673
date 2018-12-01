import json
import os
import boto3
#import botocore



def lambda_handler(event, context):
    BUCKET_NAME = os.environ['BUCKET_NAME'] # set Environment Variable: BUCKET_NAME
    s3 = boto3.resource('s3')
    bucket_tagging = s3.BucketTagging(BUCKET_NAME)
    
    return {
    "tag_set": bucket_tagging.tag_set
    #"json tag_set": json.dumps(bucket_tagging.tag_set)
    }
    



