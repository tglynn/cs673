import json
import boto3
from boto3.dynamodb.conditions import Key
import os

details = os.environ['DETAILS']

ddb = boto3.resource('dynamodb')
details_table = ddb.Table(details)

def lambda_handler(event, context):
    
    items = details_table.scan()['Items']
    
    return items