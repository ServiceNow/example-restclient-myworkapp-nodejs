/*
Copyright © 2016 ServiceNow, Inc.
 
This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

/*
 * This module dispatches the task related operations to relevant task api method. It assumes an earlier
 * request using authenticate module should have save the cookie in session.
 */
module.exports = {
	// Returns the tasks assigned to user.	
    getTasks: function(serverRequest, serverResponse) {
        if (serverRequest.session && serverRequest.session.snConfig && serverRequest.session.snConfig.snCookie) {
            var SNTask = serverRequest.app.get('snTask');
            var options = serverRequest.app.get('options');
            var snTask = new SNTask(serverRequest.session.snConfig.snInstanceURL, serverRequest.session.snConfig.snCookie, options);
            snTask.getTasks(function(error, response, body) {
                serverRequest.app.get('respLogger').logResponse(options, response, body);
                if (!error) {
                    if (response.statusCode == 200) {
                    	// the successful body message should contain all the tasks as a JSON message.
                        serverResponse.status(response.statusCode).send(body);
                    } else if (response.statusCode == 400) {
                        serverResponse.status(response.statusCode).send('The Task Tracker API is not found on this instance. Did you install the "My Work" Update Set?');
                    } else {
                        serverResponse.status(response.statusCode).send(
                            'Error occured while communicating with ServiceNow instance. ' + response.statusMessage);
                    }
                } else {
                	serverResponse.status(500).send(
                        'Error occured while communicating with ServiceNow instance. ');
                }
            });
        } else {
            serverResponse.status(401).send('User session invalidated');
        }
    },
    // Adds a comments for a given task. Task id is part of the url and comment is send at the request body. Here we 
    // assume the user is a legitimate user and should have logged in and viewed tasks before making this request.
    addComment: function(serverRequest, serverResponse) {
        var bodyString = '';
        // Aggregate the request body parts to create the whole message.
        serverRequest.on('data', function(data) {
            bodyString += data;
        });

        //After receive all parts, we need to send the message to ServiceNow backend. 
        serverRequest.on('end', function() {
            var body = JSON.parse(bodyString);
            var SNTask = serverRequest.app.get('snTask');
            var options = serverRequest.app.get('options');
            var snTask = new SNTask(serverRequest.session.snConfig.snInstanceURL, serverRequest.session.snConfig.snCookie, options);
            snTask.addComment(serverRequest.params.taskid, body.comment, function(error, response, body) {
                serverRequest.app.get('respLogger').logResponse(options, response, body);
                serverResponse.status(response.statusCode).send(body);
            });
        });
    },

    // Returns the comments for a given task. The task id is received as the part of url. Here also we assume user is a legitimate
    // user and he has already logged in and has viewed the tasks.
    getComments: function(serverRequest, serverResponse) {
        var SNTask = serverRequest.app.get('snTask');
        var options = serverRequest.app.get('options');
        // Session cookie should be available in session at this time.
        var snTask = new SNTask(serverRequest.session.snConfig.snInstanceURL, serverRequest.session.snConfig.snCookie, options);
        snTask.getComments(serverRequest.params.taskid, function(error, response, body) {
            serverRequest.app.get('respLogger').logResponse(options, response, body);
            serverResponse.status(response.statusCode).send(body);
        });
    }
}
