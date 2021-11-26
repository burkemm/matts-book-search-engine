const jwt = require('jsonwebtoken');

// set the token to secret and expire the session in 2 hours.
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
	// this function authenticates the middleware and applies the authenticated routes.
	authMiddleware: function ({ req }) {
		// This sets the token to be sent by req.qery, req.body, and req.headers.
		let token = req.body.token || req.query.token || req.headers.authorization;

		if (req.headers.authorization) {
			token = token.split(' ').pop().trim();
		}
		// if no token exists then return the request.
		if (!token) {
			return req;
		}

			// verify the token and retrieve the user data.
		try {
			const { data } = jwt.verify(token, secret, { maxAge: expiration });
			req.user = data;
		} catch {
			console.log('Invalid token');
		}

		// return updated request object
		return req;

	},
	// This signtoken function returns the data payload, encrypted, with the expiration of the token.
	signToken: function ({ username, email, _id }) {
		const payload = { username, email, _id };

		return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
	},
};
