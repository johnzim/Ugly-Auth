var Sequelize = require('sequelize');
var passwordHash = require('password-hash');

db = new Sequelize('authdb', 'admin', 'password', {
  host: "localhost",
  port: 8889
});

module.exports = function(Sequelize, Datatypes) {
	return db.define("User", {
		username: Datatypes.STRING,
		city: Datatypes.STRING,
		password: Datatypes.STRING
	}, 
	{ instanceMethods: {
		validPassword: 	function(password) {
			// password-hash stores the salt inside the hashed password so it only
			// needs one field. It uses the default crypto engine in node.js so is
			// sufficiently secure for our purposes. Here this.password is hashed
			if (passwordHash.verify(password, this.password)) {
				return true;
			} else {
				return false;
			}

		} 
	}
	}
	)

};

