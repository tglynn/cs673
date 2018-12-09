/// <reference types='aws-sdk' />

function loadProjects() {
    // create JSON object for parameters for invoking Lambda function
    var params = {
        FunctionName : 'get_all_projects',
        InvocationType : 'RequestResponse',
        LogType : 'Tail',
    };

    // Send params to global lambda function
	triggerLambda(params);

}

// $( document ).ready(function() {

    // $('#myModal').on('shown.bs.modal', function () {
    //     project_data = message[project_selected_id];
    //     $( "#project_name" ).text(project_data['project_name']);
    //     $( "#project_description" ).text(project_data['description']);
        
    // });

    // $( ".class" ).click(function() {
    //     console.log('div');
    // });

// });