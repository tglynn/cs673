/// <reference types='aws-sdk' />

function loadProjects() {
	//console.log('start of getS3');
	AWS.config.update({region: 'us-east-2'}); // Region

	// REPLACE THIS WITH ACTUAL POOLID
	AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'us-east-2:a5d9d6fd-d823-4020-a031-7b3c98405d40',
    });
    var lambda = new AWS.Lambda({region: 'us-east-2', apiVersion: '2015-03-31'});

    // create JSON object for parameters for invoking Lambda function
    var params = {
        FunctionName : 'getAllFilenames',
        InvocationType : 'RequestResponse',
        LogType : 'Tail',
    };

    //console.log('pre lambda invoke');

    // create opening HTML tag for dynamic card population
    // var output = "<div id='projects' class='row'>";
	

	// Feed parameters to the lambda invocation
	lambda.invoke(params, function(error, data) {
        if (error) {
        	prompt(error);
        	window.alert(JSON.parse(error));
        } else {
			//console.log('invoke data');
			// console.log(data.Payload);
        	var message = JSON.parse(data.Payload).message;
        	//console.log(message['name']);

        	// Break-up data:
        	var filenames = message['name'];
        	var filedesc = message['desc'];

			//console.log(message['name']);
			
		    for (var i=0; i < filenames.length; i++) {
				$( '#projects' ).append(
					'<div class="col-md-4 col-sm-6 mb-3">' +
						'<div class="card h-100 border-dark" data-toggle="modal" data-target="#showModal">' +
							'<div class="card-header">' + filenames[i] + '</div>' +
							'<div class="card-body text-dark">' +
								'<p class="card-text">' + filedesc[i] + '</p>' +
							'</div>' +
						'</div>' +
					'</div>'
				);
			}
			
	    }
	});
}