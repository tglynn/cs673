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

Bucket name: `cs673-projects-folder`

* Add access policy for GET and PUT requests for objects
   
   * In Permissions > Bucket Policy:
   
   ```
   {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::cs673-projects-folder/*"
        },
        {
            "Sid": "PublicWritePutObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:PutObject",
            "Resource": "arn:aws:s3:::cs673-projects-folder/*"
        },
        {
            "Sid": "PublicWritePutACLObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:PutObjectAcl",
            "Resource": "arn:aws:s3:::cs673-projects-folder/*"
        }
      ]
     }
   ```
   
   * In Permissions > CORS Configuration
   
   ```
   <?xml version="1.0" encoding="UTF-8"?>
   <CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
   <CORSRule>
       <AllowedOrigin>*</AllowedOrigin>
       <AllowedMethod>PUT</AllowedMethod>
       <AllowedMethod>POST</AllowedMethod>
       <AllowedMethod>GET</AllowedMethod>
       <AllowedMethod>HEAD</AllowedMethod>
       <MaxAgeSeconds>3000</MaxAgeSeconds>
       <AllowedHeader>Authorization</AllowedHeader>
   </CORSRule>
   </CORSConfiguration>
   ```



