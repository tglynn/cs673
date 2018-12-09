var search_terms = []
$( document ).ready(function() {

    // Search-Terms
    $( "#search-terms-btn" ).click((e) => {
        // e.preventDefault();
        var value = $( "#search-terms-in" ).val();
        search_terms.push('"'+value+'"');
		var close_id = "term-" + value;
		console.log(value);
		console.log(search_terms);
		console.log(close_id);
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
    });

    $( "#search-terms-in" ).keypress((e) => {
        if ( e.which == 13 ) {
            // e.preventDefault();
            $( "#search-terms-btn" ).click();
        }
	});
	
});

function closeTerm(close_btn) {
	// console.log(search_terms);
	var term = close_btn.id.replace("term-", "")
	// console.log(term);
	var index = search_terms.indexOf('"'+term+'"'); //indexOf may not be supported in IE 7 & 8
	console.log(index)
	if (index > -1) {
	  search_terms.splice(index, 1);
	}
	// console.log(search_terms);
	findProjects();
}

function findProjects() {
	// var terms = $( "#search-terms-in" ).value();
	// console.log(search_terms);

	if (search_terms.length == 0) {
		$( '#projects' ).empty();
	} else {

	    // create JSON object for parameters for invoking Lambda function
	    // console.log('{"search_term" : [' + search_terms + ']}');
	    var params = {
	        FunctionName : 'search_has_any',
	        InvocationType : 'RequestResponse',
	        LogType : 'Tail',
	        Payload : '{"search_term" : [' + search_terms + ']}' //["python", "2018", "git"]}'
	    };

		// Feed parameters to the lambda invocation
		triggerLambda(params);
		
	}
	
}

