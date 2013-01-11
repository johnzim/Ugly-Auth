var Sequelize = require('sequelize');
db = new Sequelize('authdb', 'admin', 'password', {
  host: "localhost",
  port: 8889
});

module.exports = function(Squelize, Datatypes) {
	return db.define("Session", {
		id: Datatypes.INTEGER,
		session_id: Datatypes.STRING
	})
};
