function triggerLambda(params) {
    AWS.config.update({region: 'us-east-2'}); // Region

    // REPLACE THIS WITH ACTUAL POOLID
    //Jen's test id: us-east-2:a5d9d6fd-d823-4020-a031-7b3c98405d40
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'us-east-2:1c5c4b60-8923-4c04-9ae9-71a82cc4f087',
    });
    var lambda = new AWS.Lambda({region: 'us-east-2', apiVersion: '2015-03-31'});

    lambda.invoke(params, function(error, data) {
        if (error) {
            prompt(error);
            window.alert(JSON.parse(error));
        } else {
            //console.log('invoke data');
            // console.log(data.Payload);
            var message = JSON.parse(data.Payload);
            //console.log(message['name']);

            var s3_path = "https://s3.us-east-2.amazonaws.com/cs673-projects-folder"

            console.log(message);
            $( '#projects' ).empty();
            
            for (var i=0; i < message.length; i++) {
                // break-up data for readability
                var project_name = message[i]['project_name']
                var year = message[i]['year']
                var semester = message[i]['semester']
                var instructor = message[i]['instructor']
                var github = message[i]['github']
                var description = message[i]['description']
                var project_path = message[i]['project_path'].split(' ').join('+') // replace spaces with '+' to match S3 path format

                console.log(project_path)
                
                // joined strings
                var subheader = semester + " " + year
                var s3_download = s3_path + project_path

                $( '#projects' ).append(
                    '<div class="col-md-4 col-sm-6 mb-3">' +
                        '<div class="card h-100 border-dark" data-toggle="modal" data-target="#showModal">' +
                            '<div class="card-header">' + project_name + '<br><i>' + subheader + '</i></div>' +
                            '<div class="card-body text-dark">' +
                                '<p class="card-text">' + description + '</p>' +
                                '<p><a href="' + s3_download + '" target="_blank">Download</a></p>' +
                            '</div>' +
                        '</div>' +
                    '</div>'
                );
            }
            
        }
    });
}