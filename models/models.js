var Sequelize = require('sequelize');
db = new Sequelize('authdb', 'admin', 'password', {
	host: "localhost",
	port: 8889
});

var User = db.define('User', {
	name: Sequelize.STRING,
	city: Sequelize.STRING
});

var Session = db.define('Session', {
	session_id: Sequelize.STRING
});


User.sync();
Session.sync();