#!/usr/bin/env python

import unittest
from moto import mock_s3, mock_dynamodb2
from upload_lambda import get_required_vars, upload_file, commit_search_tags, lambda_handler


# This doesn't work with moto, cannot mock the nested functions.
# TODO mock this more thoroughly, allow end to end test
#class LambdaHandlerCase(unittest.TestCase):
#    """ Tests the lambda handler """
#
#    def test_upload(self):
#        import os
#        os.environ['BUCKET'] = 'test_bucket'
#        os.environ['SEARCH'] = 'test_search'
#        os.environ['REGION'] = 'test_region'
#
#        test_event = {
#            'content-location': '/test/test1.txt',
#            'content-type': 'application/text',
#            'content' : {
#                'body': 'Test application!',
#                'encoding': 'utf-8',
#                'tag_data' : {
#
#                "Identifier":
#                    ("/test/test1.txt",
#                     "Project Upload Repository"),
#                "terms": {
#                    "Project Upload Repository": "project_name",
#                    "2018": "year",
#                    "Fall": "semester",
#                    "Alex Elentukh": "instructor",
#                    "python": "programming_language",
#                    "html": "programming_language",
#                    "css": "programming_language",
#                    "javascript": "programming_language",
#                    "s3": "framework",
#                    "AWS": "framework",
#                    "dynamodb": "framework",
#                    "bootstrap": "framework",
#                    "repository": "keyword",
#                    "search": "keyword"
#                    }
#                }
#            }
#        }
#        with mock_s3(), mock_dynamodb2():
#            result = lambda_handler(test_event, {})
#
#        self.assertEqual(result, "Project uploaded and tagged")

class CommitSearchCase(unittest.TestCase):
    """Tests the dynamodb tag committing"""

    @mock_dynamodb2
    def test_key_insertion(self):
        import boto3

        dynamodb = boto3.resource('dynamodb',region_name = 'us-east-2')

        table = dynamodb.create_table(
            TableName='project_search',
            KeySchema=[
                {
                    'AttributeName': 'search_term',
                    'KeyType': 'HASH',  #Partition key
                }
            ],
            AttributeDefinitions=[
                {
                    'AttributeName': 'search_term',
                    'AttributeType': 'S',
                }
            ],
            ProvisionedThroughput={
                'ReadCapacityUnits': 10,
                'WriteCapacityUnits': 10,
            }
        )

        test_data = {
        "Identifier":
            ("/2018/fall/Project Upload Repository.pdf",
             "Project Upload Repository"),
        "terms": {
            "Project Upload Repository": "project_name",
            "2018": "year",
            "Fall": "semester",
            "Alex Elentukh": "instructor",
            "python": "programming_language",
            "html": "programming_language",
            "css": "programming_language",
            "javascript": "programming_language",
            "s3": "framework",
            "AWS": "framework",
            "dynamodb": "framework",
            "bootstrap": "framework",
            "repository": "keyword",
            "search": "keyword"
            }
        }

        results = commit_search_tags(table, test_data)
        self.assertEqual(len(results), len(test_data['terms']))

    @mock_dynamodb2
    def test_key_retrieve(self):
        import boto3

        dynamodb = boto3.resource('dynamodb',region_name = 'us-east-2')

        table = dynamodb.create_table(
            TableName='project_search',
            KeySchema=[
                {
                    'AttributeName': 'search_term',
                    'KeyType': 'HASH',  #Partition key
                }
            ],
            AttributeDefinitions=[
                {
                    'AttributeName': 'search_term',
                    'AttributeType': 'S',
                }
            ],
            ProvisionedThroughput={
                'ReadCapacityUnits': 10,
                'WriteCapacityUnits': 10,
            }
        )

        test_data = {
        "Identifier":
            ("/2018/fall/Project Upload Repository.pdf",
             "Project Upload Repository"),
        "terms": {
            "Project Upload Repository": "project_name",
            "2018": "year",
            "Fall": "semester",
            "Alex Elentukh": "instructor",
            "python": "programming_language",
            "html": "programming_language",
            "css": "programming_language",
            "javascript": "programming_language",
            "s3": "framework",
            "AWS": "framework",
            "dynamodb": "framework",
            "bootstrap": "framework",
            "repository": "keyword",
            "search": "keyword"
            }
        }
        results = commit_search_tags(table, test_data)
        table_read = table.get_item(Key= {'search_term': 'python'})
        self.assertEqual(table_read['ResponseMetadata']['HTTPStatusCode'], 200)
        self.assertTrue('/2018/fall/Project Upload Repository.pdf' in table_read['Item']['project_name'])


class UploadFileCase(unittest.TestCase):
    """ Tests the s3 upload functionality """

    @mock_s3
    def test_upload(self):
        import boto3
        s3 = boto3.resource('s3', 'us-east-2')
        # Create mock bucket
        s3.create_bucket(Bucket='testbucket')
        response = upload_file(s3,
                          'testbucket',
                          'test1',
                          'Test!',
                          'application/text',
                          'utf-8')
        self.assertEqual(response['ResponseMetadata']['HTTPStatusCode'], 200)

    @mock_s3
    def test_strip_leading_slash(self):
        import boto3
        s3 = boto3.resource('s3', 'us-east-2')
        # Create mock bucket
        s3.create_bucket(Bucket='testbucket')
        response = upload_file(s3,
                          'testbucket',
                          '/test1',
                          'Test!',
                          'application/text',
                          'utf-8')
        body = s3.Object('testbucket', 'test1').get()['Body']
        self.assertTrue(body)

    @mock_s3
    def test_get_mismatch(self):
        import boto3
        from botocore.exceptions import ClientError
        s3 = boto3.resource('s3', 'us-east-2')
        # Create mock bucket
        s3.create_bucket(Bucket='testbucket')
        response = upload_file(s3,
                          'testbucket',
                          'test1',
                          'Test!',
                          'application/text',
                          'utf-8')
        self.assertRaises(ClientError, lambda:s3.Object('testbucket', 'bogusfile').get())

    @mock_s3
    def test_content_after_upload(self):
        import boto3
        s3 = boto3.resource('s3', 'us-east-2')
        # Create mock bucket
        s3.create_bucket(Bucket='testbucket')
        response = upload_file(s3,
                          'testbucket',
                          'test1',
                          'Test!',
                          'application/text',
                          'utf-8')
        body = s3.Object('testbucket', 'test1').get()['Body'].read().decode("utf-8")
        self.assertEqual(body, 'Test!')
        
        

class RequiredVarsCase(unittest.TestCase):
    """ Tests required vars function in upload_lambda """

    def test_defaults(self):
        """ Test that the defaults return as expected when env vars
        are not set """
        import os
        if os.environ.get('BUCKET'):
            del os.environ['BUCKET']
        if os.environ.get('SEARCH'):
            del os.environ['SEARCH']
        if os.environ.get('REGION'):
            del os.environ['REGION']
        self.assertEqual(('cs673-projects-folder',
                          'project_search',
                          'us-east-2'),
                         get_required_vars())

    def test_set_new(self):
        """ Test that env vars can be set to override default"""
        import os
        os.environ['BUCKET'] = 'testbucket'
        os.environ['SEARCH'] = 'testsearch'
        os.environ['REGION'] = 'testregion'

        self.assertEqual(('testbucket',
                          'testsearch',
                          'testregion'),
                         get_required_vars())

        
if __name__ == "__main__":
    unittest.main()
