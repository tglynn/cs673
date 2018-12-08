/// <reference types='aws-sdk' />

var search_terms = []
$( document ).ready(function() {
    // Search-Terms
    
    $( "#search-terms-btn" ).click((e) => {
        // e.preventDefault();
        var value = $( "#search-terms-in" ).val();
        search_terms.push('"'+value+'"')
        var close_id = "term-" + value
        if (value != "") {
            $( "#search-terms-div" ).append(
                '<div class="m-1 d-inline-block alert alert-secondary alert-dismissible fade show" role="alert">' +
                    '<strong>' + value + '</strong>' +
                    '<button id="' + close_id + '" type="button" class="close" data-dismiss="alert" onclick="closeTerm(this)">' +
                        '<span aria-hidden="true">&times;</span>' +
                    '</button>' +
                '</div>'
            );
            $( "#search-terms-in" ).val("");
        }
        $( "#search-terms-in" ).focus();
        findProjects();
    })


    $( "#search-terms-in" ).keypress((e) => {
        if ( e.which == 13 ) {
            //    e.preventDefault();
            $( "#search-terms-btn" ).click();
        }
    });

});

function closeTerm(close_btn){
	console.log(search_terms)
	var term = close_btn.id.replace("term-", "")
	console.log(term)
	var index = search_terms.indexOf('"'+term+'"'); //indexOf may not be supported in IE 7 & 8
	console.log(index)
	if (index > -1) {
	  search_terms.splice(index, 1);
	}
	console.log(search_terms)
	findProjects();
}



function findProjects() {
	//var terms = $( "#search-terms-in" ).value();
	console.log(search_terms)


	if(search_terms.length == 0){
		$( '#projects' ).empty();
	}
	else{
		//console.log('start of getS3');
		AWS.config.update({region: 'us-east-2'}); // Region

		// REPLACE THIS WITH ACTUAL POOLID
		AWS.config.credentials = new AWS.CognitoIdentityCredentials({
	        IdentityPoolId: 'us-east-2:a5d9d6fd-d823-4020-a031-7b3c98405d40',
	    });
	    var lambda = new AWS.Lambda({region: 'us-east-2', apiVersion: '2015-03-31'});

	    // create JSON object for parameters for invoking Lambda function
	    console.log('{"search_term" : [' + search_terms + ']}')
	    var params = {
	        FunctionName : 'search_has_any',
	        InvocationType : 'RequestResponse',
	        LogType : 'Tail',
	        Payload : '{"search_term" : [' + search_terms + ']}' //["python", "2018", "git"]}'

	    };

		// Feed parameters to the lambda invocation
		lambda.invoke(params, function(error, data) {
	        if (error) {
	        	prompt(error);
	        	window.alert(JSON.parse(error));
	        } else {
				//console.log('invoke data');
				// console.log(data.Payload);
	        	var message = JSON.parse(data.Payload);
	        	//console.log(message['name']);

	        	// Break-up data:
	        	var filenames = message;
	        	var filedesc = message;

				console.log(message);
				$( '#projects' ).empty();
				
			    for (var i=0; i < filenames.length; i++) {
					$( '#projects' ).append(
						'<div class="col-md-4 col-sm-6 mb-3">' +
							'<div class="card h-100 border-dark" data-toggle="modal" data-target="#showModal">' +
								'<div class="card-header">' + message[i]['project_name'] + '</div>' +
								'<div class="card-body text-dark">' +
									'<p class="card-text">' + message[i]['description'] + '</p>' +
								'</div>' +
							'</div>' +
						'</div>'
					);
				}
				
		    }
		});
	}
	
}