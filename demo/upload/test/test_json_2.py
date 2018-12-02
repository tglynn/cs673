#! /usr/bin/env python

import json

project_1_data = {
    # Identifier includes the S3 Path and project name as an ordered pair
    # S3 path format: /$YEAR/$Semester/$Project File Name
    "Identifier": "/2018/fall/Project Upload Repository.pdf",
    # Note that the keys and values are a mirror of what is entered in the ui;
    # This lets us quickly query by value
    "terms": {
        # From the Project Name field
        "project_name": "Project Upload Repository",
        "year": "2018",
        "semester": "Fall",
        "instructor": "Elentukh",
        "github": "https://github.com/tglynn/cs673",
        "description": "A web site hosted using AWS components that stores past CS673 projects for new students to browse and professors to manange."
        }
    }
    
project_2_data = {
    # Identifier includes the S3 Path and project name as an ordered pair
    # S3 path format: /$YEAR/$Semester/$Project File Name
    "Identifier": "/2018/fall/Wedding Invitation Site.pdf",
    # Note that the keys and values are a mirror of what is entered in the ui;
    # This lets us quickly query by value
    "terms": {
        # From the Project Name field
        "project_name": "Wedding Invitation Site",
        "year": "2018",
        "semester": "Fall",
        "instructor": "Elentukh",
        "github": "",
        "description": "A site for sending and managing wedding invitations and RSVPS."
        }
    }
