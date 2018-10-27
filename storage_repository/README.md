### Storage backend/project repository

#### Creating and configuring the bucket

* Create a new bucket in us-east-2

    * Leave versioning off
    
    * Server access logging off

    * Turn on static website hosting

    * Object level logging off

    * Default encryption off

    * Tags - None

    * Transfer acceleration `suspended`

    * Event notifications - off

    * Requester pays - disabled

Bucket name: `cs673-project-repository`


* Add access policy for static site hosting

    * In Amazon S3 > cs673-project-repository > Permissions > Bucket Policy:

    ```
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "PublicReadGetObject",
                "Effect": "Allow",
                "Principal": "*",
                "Action": [
                    "s3:GetObject"
                ],
                "Resource": [
                    "arn:aws:s3:::cs673-project-repository/*"
                ]
            }
        ]
    }
    ```

