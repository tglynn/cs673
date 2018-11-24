#!/usr/bin/env python

import boto3

def create_table():

    dynamodb = boto3.resource('dynamodb', region_name='us-east-2', endpoint_url="http://localhost:8000")

    table = dynamodb.create_table(
        TableName='project_search',
        KeySchema=[
            {
                'AttributeName': 'search_term',
                'KeyType': 'HASH'  #Partition key
            }
        ],
        AttributeDefinitions=[
            {
                'AttributeName': 'search_term',
                'AttributeType': 'S'
            }
        ],
        ProvisionedThroughput={
            'ReadCapacityUnits': 10,
            'WriteCapacityUnits': 10
        }
    )

def add_tags_to_table(tag_data, table=None):

    if not table:
        # Work locally
        dynamodb = boto3.resource('dynamodb', region_name='us-east-2', endpoint_url="http://localhost:8000")
        table = dynamodb.Table('project_search')

    results = []
    for term in tag_data['terms']:
        results.append(
            table.update_item(
                Key = {
                    'search_term': term
                },
                UpdateExpression = "ADD project_name :p",
                ExpressionAttributeValues={
                    # Convert identifier to `set` to prevent duplication 
                    ':p': {tag_data['Identifier'][0]},
                },
                ReturnValues="UPDATED_NEW"
                )
        )
    return results



