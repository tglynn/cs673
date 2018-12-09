$( document ).ready(function() {
    // Team-Members
    
    $( "#add-team-members-btn" ).click((e) => {
        // e.preventDefault();
        var value = $( "#add-team-members-in" ).val();
        if (value != "") {
            $( "#add-team-members-div" ).append(
                '<div class="m-1 d-inline-block alert alert-secondary alert-dismissible fade show" role="alert">' +
                    '<strong>' + value + '</strong>' +
                    '<button type="button" class="close" data-dismiss="alert">' +
                        '<span aria-hidden="true">&times;</span>' +
                    '</button>' +
                '</div>'
            );
            $( "#add-team-members-in" ).val("");
        }
        $( "#add-team-members-in" ).focus();
    });

    $( "#add-team-members-in" ).keypress((e) => {
        if ( e.which == 13 ) {
            //    e.preventDefault();
            $( "#add-team-members-btn" ).click();
        }
    });

    // Programming-Languages
    
    $( "#add-programming-languages-btn" ).click((e) => {
        // e.preventDefault();
        var value = $( "#add-programming-languages-in" ).val();
        if (value != "") {
            $( "#add-programming-languages-div" ).append(
                '<div class="m-1 d-inline-block alert alert-secondary alert-dismissible fade show" role="alert">' +
                    '<strong>' + value + '</strong>' +
                    '<button type="button" class="close" data-dismiss="alert">' +
                        '<span aria-hidden="true">&times;</span>' +
                    '</button>' +
                '</div>'
            );
            $( "#add-programming-languages-in" ).val("");
        }
        $( "#add-programming-languages-in" ).focus();
    });

    $( "#add-programming-languages-in" ).keypress((e) => {
        if ( e.which == 13 ) {
            //    e.preventDefault();
            $( "#add-programming-languages-btn" ).click();
        }
    });

    // Frameworks
    
    $( "#add-frameworks-btn" ).click((e) => {
        // e.preventDefault();
        var value = $( "#add-frameworks-in" ).val();
        if (value != "") {
            $( "#add-frameworks-div" ).append(
                '<div class="m-1 d-inline-block alert alert-secondary alert-dismissible fade show" role="alert">' +
                    '<strong>' + value + '</strong>' +
                    '<button type="button" class="close" data-dismiss="alert">' +
                        '<span aria-hidden="true">&times;</span>' +
                    '</button>' +
                '</div>'
            );
            $( "#add-frameworks-in" ).val("");
        }
        $( "#add-frameworks-in" ).focus();
    });

    $( "#add-frameworks-in" ).keypress((e) => {
        if ( e.which == 13 ) {
            //    e.preventDefault();
            $( "#add-frameworks-btn" ).click();
        }
    });

    // Keywords
    
    $( "#add-keywords-btn" ).click((e) => {
        // e.preventDefault();
        var value = $( "#add-keywords-in" ).val();
        if (value != "") {
            $( "#add-keywords-div" ).append(
                '<div class="m-1 d-inline-block alert alert-secondary alert-dismissible fade show" role="alert">' +
                    '<strong>' + value + '</strong>' +
                    '<button type="button" class="close" data-dismiss="alert">' +
                        '<span aria-hidden="true">&times;</span>' +
                    '</button>' +
                '</div>'
            );
            $( "#add-keywords-in" ).val("");
        }
        $( "#add-keywords-in" ).focus();
    });

    $( "#add-keywords-in" ).keypress((e) => {
        if ( e.which == 13 ) {
            //    e.preventDefault();
            $( "#add-keywords-btn" ).click();
        }
    });

    // Upload Function

    $( "#upload-btn" ).click(function() {
        var file = $("#add_project_files")[0].files[0];
	var reader = new FileReader()

        reader.addEventListener("load", function () {
	    var str = reader.result
	    var encoded_content = str.slice(str.indexOf(",") + 1);
            var year = $.trim($( "#year" ).val());
            var semester = $.trim($( "#semester option:selected" ).text());
            var content_location = "/" + year + "/" + semester + "/" + file.name;
	    var rel_s3_path = year + "/" + semester + "/" + file.name;
            var project_name = $.trim($( "#project_name" ).val());
            var instructor = $.trim($( "#instructor" ).val());
            var description = $.trim($( "#description" ).val());
            var github = $.trim($( "#github" ).val());
            var pivotal_tracker = $.trim($( "#pivotal_tracker" ).val());
            var website = $.trim($( "#website" ).val());

	    // Commit file to S3
	    var s3_params = {
		    s3_path: rel_s3_path,
		    uploadfile: file
	    };

	    commitToS3(s3_params);

            data_to_be_sent = {
                "content-location": content_location,
                "content-type": file.type,
                "content": {
                    "details": {
                        "project_name": project_name,
                        "year": year,
                        "semester": semester,
                        "instructor": instructor,
                        "github": github,
                        "description": description,
                        "pivotal_tracker": pivotal_tracker,
                        "website": website,
                        "team_members": []
                    },
                    "tag_data": {
                        "Identifier": [
                            content_location,
                            project_name
                        ],
                        "terms": {}
                    }
                }
            };

            $( "#add-keywords-div > div > strong" ).each(function() {
                data_to_be_sent.content.tag_data.terms[$.trim($( this ).text()).toLowerCase()] = "keyword";
            });

            $( "#add-frameworks-div > div > strong" ).each(function() {
                data_to_be_sent.content.tag_data.terms[$.trim($( this ).text()).toLowerCase()] = "framework";
            });

            $( "#add-programming-languages-div > div > strong" ).each(function() {
                data_to_be_sent.content.tag_data.terms[$.trim($( this ).text()).toLowerCase()] = "programming_language";
            });

            $( "#add-team-members-div > div > strong" ).each(function() {
                data_to_be_sent.content.details.team_members.push($.trim($( this ).text()).toLowerCase());
            });

            var request = $.ajax({
                url: "https://yh956nkkj5.execute-api.us-east-2.amazonaws.com/default/project_uploader",
                method: "POST",
                data: JSON.stringify(data_to_be_sent),
                dataType: "json"
            });
               
            request.done(function( msg ) {
                console.log('done');
                console.log(msg);
            });
               
            request.fail(function( jqXHR, textStatus ) {
                console.log('failed');
                console.log("Request failed: " , textStatus , jqXHR.status, jqXHR);
            });

        }, false);

        if (file) {
            reader.readAsDataURL(file);
        }
    });

});


function commitToS3(s3_params) {
    AWS.config.update({region: 'us-east-2'}); 
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'us-east-2:13261f3a-e497-435b-b7cd-f5e8a4f69459',
    });
    var s3 = new AWS.S3({params: {Bucket: 'cs673-projects-folder'}, apiVersion: '2006-03-01'});

    s3.upload({
	Key: s3_params.s3_path,
	Body: s3_params.uploadfile,
	ACL: 'public-read'
    }, function(err, data) {
	if (err) {
	    console.log('There was an error uploading project: ',err, err.stack);
	}
  });
}
