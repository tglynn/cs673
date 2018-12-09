function loadProjects() {
    // create JSON object for parameters for invoking Lambda function
    var params = {
        FunctionName : 'get_all_projects',
        InvocationType : 'RequestResponse',
        LogType : 'Tail',
    };

	triggerLambda(params);
}