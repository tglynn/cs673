$( document ).ready(function() {
    window.s3_path = "https://s3.us-east-2.amazonaws.com/cs673-projects-folder";
});

function triggerLambda(params) {
    AWS.config.update({region: 'us-east-2'});
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'us-east-2:1c5c4b60-8923-4c04-9ae9-71a82cc4f087',
    });
    
    var lambda = new AWS.Lambda({region: 'us-east-2', apiVersion: '2015-03-31'});
    lambda.invoke(params, function(error, data) {
        
        if (error) {
            prompt(error);
            window.alert(JSON.parse(error));
        } else {
            window.message = JSON.parse(data.Payload);
            $( '#projects' ).empty();

            if (message != null) {
                for (var i=0; i < message.length; i++) {
                    // break-up data for readability
                    var project_name = message[i]['project_name']
                    var year = message[i]['year']
                    var semester = message[i]['semester']
                    var instructor = message[i]['instructor']
                    var github = message[i]['github']
                    var description = message[i]['description']
                    
                    // format strings
                    var subheader = semester + " " + year + " | " + instructor
                    if(description.length > 160){
                        description = description.substring(0,160) + "...";
                    }
    
                    $( '#projects' ).append(
                        '<div class="col-md-4 col-sm-6 mb-3">' +
                            '<div id="' + i + '" class="card h-100 border-dark" data-toggle="modal" data-target="#myModal">' +
                                '<div class="card-header">' + project_name + '<br> <i>' + subheader + '</i></div>' +
                                '<div class="card-body text-dark">' +
                                    '<p class="card-text">' + description + '</p>' +
                                '</div>' +
                            '</div>' +
                        '</div>'
                    );
                }
            }
            
        }
    });
}