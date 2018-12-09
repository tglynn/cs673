var search_terms = []
$( document ).ready(function() {
	// Search-Terms
    $( "#search-terms-btn" ).click((e) => {
        var value = $( "#search-terms-in" ).val();
        search_terms.push('"'+value+'"');
		var close_id = "term-" + value;
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
            $( "#search-terms-btn" ).click();
        }
	});
	
});

function closeTerm(close_btn) {
	var term = close_btn.id.replace("term-", "")
	var index = search_terms.indexOf('"'+term+'"'); //indexOf may not be supported in IE 7 & 8
	if (index > -1) {
	  search_terms.splice(index, 1);
	}
	findProjects();
}

function findProjects() {
	if (search_terms.length == 0) {
		$( '#projects' ).empty();
	} else {
	    var params = {
	        FunctionName : 'search_has_any',
	        InvocationType : 'RequestResponse',
	        LogType : 'Tail',
	        Payload : '{"search_term" : [' + search_terms + ']}' //["python", "2018", "git"]}'
	    };

		triggerLambda(params);
		
	}
	
}

