const log = console.log;
const jwt = require('jsonwebtoken');
const secret = "my little secret";
const expiry = 24 * 60 * 60 * 1000;

//CREATE TOKEN
exports.createToken = function(user) {
	try {
		let token = jwt.sign({
			id: user._id,
			email: user.email
		}, secret, {expiresIn: expiry});
		log('done');
		return token;
	}
	catch(err) {
		log(err);
		return null;
	}
}
//DECODE
exports.decodeToken = function(token) {
	try {
		let decodedToken = jwt.verify(token, secret);
		return decodedToken; 
	}
	catch(err) {
		log(err);
		return null;
	}
}
