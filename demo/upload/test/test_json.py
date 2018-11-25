#! /usr/bin/env python

import json

project_1_data = {
    # Identifier includes the S3 Path and project name as an ordered pair
    # S3 path format: /$YEAR/$Semester/$Project File Name
    "Identifier":
    ("/2018/fall/Project Upload Repository.pdf", "Project Upload Repository"),
    # Note that the keys and values are a mirror of what is entered in the ui;
    # This lets us quickly query by value
    "terms": {
        # From the Project Name field
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
    
project_2_data = {
    # Identifier includes the S3 Path and project name as an ordered pair
    # S3 path format: /$YEAR/$Semester/$Project File Name
    "Identifier":
    ("/2018/fall/Wedding Invitation Site.pdf", "Wedding Invitation Site"),
    # Note that the keys and values are a mirror of what is entered in the ui;
    # This lets us quickly query by value
    "terms": {
        # From the Project Name field
        "Wedding Invitation Site": "project_name",
        "2018": "year",
        "Fall": "semester",
        "Alex Elentukh": "instructor",
        "node": "programming_language",
        "html": "programming_language",
        "css": "programming_language",
        "javascript": "programming_language",
        "react": "framework",
        "MySQL": "framework",
        "relational database": "keyword",
        "wedding": "keyword",
        "website": "keyword"
        }
    }
