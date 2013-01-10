var _ = require('underscore');
var usersArray = ['paul', 'pie', 'mike'];

var id = 12345;

exports.findOne = function(username) {    
    console.log("called");
    if (_.indexOf(usersArray, username.username, false) == -1) {
        return false;
    } else {
        return { username: username.username, id: id };
    }
}

exports.validPassword = function(password) {
    if (password == 'toolkit') {
        return true;
    } else {
        return false;
    }
}
