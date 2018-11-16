import json
import boto3
from boto3.dynamodb.conditions import Key
import os

DDB_TABLE = os.environ['DDB_TABLE'] # set Environment Variable: DDB_TABLE

ddb = boto3.resource('dynamodb')
table = ddb.Table(DDB_TABLE)

def lambda_handler(event, context):
    # resulting files
    res_files = []
    
    for i in range(len(event['tag'])):
    
        # DynamoDB query outputs:{'Items':[{'filenames':[LIST OF FILENAMES],...]}
        ddb_item = table.query(
            KeyConditionExpression=Key('tag').eq(event['tag'][i])
            )['Items']
            
        # no items with tag, stop looking  
        if len(ddb_item) is 0: 
            break;
            
        # first tag so grab everything
        elif i is 0: 
            res_files = ddb_item[0]['filenames']
        
        # more than one tag
        else:
            cur_files = ddb_item[0]['filenames']
            
            # check for intersection
            res_files = [val for val in cur_files if val in res_files]

    if len(res_files) > 0:
        return {"message": res_files #json.dumps(message)
        }
    else:
        return{"message": "No objects meeting criteria were found"}




