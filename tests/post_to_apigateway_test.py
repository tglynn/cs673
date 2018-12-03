#!/usr/bin/env python

import requests
import base64
import json
import subprocess

API_URL = "https://yh956nkkj5.execute-api.us-east-2.amazonaws.com/default/project_uploader"
PATH_TO_FILE = "./Aurelius+CS633+OL+Spring+2018.pdf"

with open(PATH_TO_FILE, 'rb') as f:
    rawbytes = f.read()
encoded_content = base64.b64encode(rawbytes).decode()

test_data = {
  "content-location": "/2018/Spring/Aurelius CS633 OL Spring 2018.pdf",
  "content-type": "application/pdf",
  "content": {
    "encoded_file": encoded_content,
    "encoding": "base64",
    "tag_data": {
      "Identifier": [
        "/2018/Spring/Aurelius CS633 OL Spring 2018.pdf",
        "Sudoku"
      ],
      "terms": {
        "2018": "year",
        "Sudoku": "project_name",
        "Spring": "semester",
        "Alex Elentukh": "instructor",
        "javascript": "programming_language",
        "s3": "framework",
        "game": "keyword",
        "cards": "keyword",
        "matching": "keyword",
        "git": "version_control"
      }
    }
  }
}


r = requests.post(API_URL, data = json.dumps(test_data))

print(r)


