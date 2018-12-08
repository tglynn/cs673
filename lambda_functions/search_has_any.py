import json
import boto3
from boto3.dynamodb.conditions import Key
import os

DDB_TABLE = os.environ['DDB_TABLE'] # set Environment Variable: DDB_TABLE

ddb = boto3.resource('dynamodb')
table = ddb.Table(DDB_TABLE)

def lambda_handler(event, context):
    # resulting files
    projects_found = []
    
    for i in range(len(event['search_term'])): # assume set of terms: {'java', 'android'}
    
        # DynamoDB query outputs:{'Items':[{'project_name':StringSet,...]}
        ddb_item = table.query(
            KeyConditionExpression=Key('search_term').eq(event['search_term'][i])
            )['Items']
            
        # If 0 then no items with term, skip
        if len(ddb_item) > 0: 
            projects_temp = ddb_item[0]['project_name']
            projects_found = [val for val in projects_temp if not in projects_found]

    if len(projects_found) > 0:
        return {"message": projects_found #json.dumps(message)
        }
    else:
        return{"message": "No projects meet any of your search criteria"}




