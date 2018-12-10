import json
import boto3
from boto3.dynamodb.conditions import Key
import os

search = os.environ['SEARCH']
details = os.environ['DETAILS']

ddb = boto3.resource('dynamodb')
search_table = ddb.Table(search)
details_table = ddb.Table(details)

def lambda_handler(event, context):
    projects_found = set()
    for i in range(len(event['search_term'])): # list of terms: ['java', 'android']
    
        # DynamoDB query outputs:{'Items':[{'project_path':StringSet,...]}
        term_list = search_table.query(
            KeyConditionExpression=Key('search_term').eq(event['search_term'][i].lower())
            )['Items']
        #print (term_list)
        
        if len(term_list) > 0: # If nil then term not inDDB
            projects_found = projects_found.union(term_list[0]['project_path'])
    
    projects = list(projects_found) # convert to list for JSON
    project_details = retrieve_project_info(projects)
    
    ## Put project details retrieval here ##
    print (project_details)
    
    if len(project_details) > 0:
        return project_details #json.dumps(message)
        
    else:
        return None


def retrieve_project_info(projects): #list
    # grab proj details DDB
    project_details = []
    for filepath in projects:
        # send to DDB
        items = details_table.query(
            KeyConditionExpression=Key('project_path').eq(filepath))['Items']
        #project_details.append(project)
        if len(items) > 0:
            project_details.append(items[0])

    return project_details
        
