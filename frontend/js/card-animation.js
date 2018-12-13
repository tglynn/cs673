function loadCardAnimation() {

    $( "#projects" ).on("mouseenter", ".card", function() {
        $( this ).addClass( "shadow-lg");
        $( this ).animate({
            marginTop: "-=1%",
        }, 200);
    });
    
    $( "#projects" ).on("mouseleave", ".card", function() {
        $( this ).removeClass( "shadow-lg");
        $( this ).animate({
            marginTop: "0%",
        }, 200);
    });
    
    $( "#projects" ).on("click", ".card", function() {
        selected_project = message[$ ( this ).attr('id')];
        
        // modal header
        var project_name = selected_project['project_name'];
        var subheader = selected_project['semester'] + " " + selected_project['year'];
        if (project_name != "" && subheader != "") {
            $ ( ".modal-title").html(project_name + ', <i>' + subheader + '<i/>');
        }
    
        // modal body
        var project_body = "";
        project_description = selected_project['description'];
        if (project_description != "") {
            project_body += '<strong>Description:</strong>';
            project_body += '<p>' + project_description + '</p><hr>';
        }
        project_instructor = selected_project['instructor'];
        if (project_instructor != "") {
            project_body += '<strong>Instructor:</strong> ' + project_instructor + '<hr>';
        }
        project_team_members = selected_project['team_members'];
        if (project_team_members.length > 0) {
            project_body += '<strong>Team Members:</strong>';
            project_body += '<ul>';
            project_team_members.forEach(team_member => {
                project_body += '<li>' + team_member + '</li>';
            });
            project_body += '</ul><hr>';
        }
        project_website = selected_project['website'];
        if (typeof(project_website) !== "undefined") {
            project_body += '<strong><a href="' + project_website + '" target="_blank">Website</a></strong>';
        }
        else{
        	project_body += '<strong>Website</strong>'
        }
        project_github = selected_project['github'];
        if (typeof(project_github) !== "undefined") {
            project_body += ', <strong><a href="' + project_github + '" target="_blank">GitHub</a></strong>';
        }
        else{
        	project_body += ', <strong>GitHub</strong>'
        }
        project_pivotal_tracker = selected_project['pivotal_tracker'];
        if (typeof(project_pivotal_tracker) !== "undefined") {
            project_body += ', <strong><a href="' + project_pivotal_tracker + '" target="_blank">Pivotal Tracker</a></strong>';
        }
        else{
        	project_body += ', <strong>Pivotal Tracker</strong>'
        }
    
        // modal footer
        var project_path = selected_project['project_path'].split(' ').join('+'); // replace spaces with '+' to match S3 path format
        var s3_download = s3_path + project_path;
    
        if (s3_download != "") {
            $( "#btn_download" ).attr('onClick', 'location.href="' + s3_download + '"');
        } else {
            $( "#btn_download" ).removeAttr('onClick');
        }
    
        $ ( ".modal-body" ).html(project_body, function() {
            $('#myModal').modal({show:true});
        });
    });

}