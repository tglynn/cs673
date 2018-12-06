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

});