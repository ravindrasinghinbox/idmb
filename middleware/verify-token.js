const jwt = require('jsonwebtoken');
var ObjectId = require('mongodb').ObjectID;

module.exports = (req, res, next) => {
	const token = req.headers['x-access-token'] || req.body.token || req.query.token

	if(token){
		jwt.verify(token, req.app.get('api_secret_key'), (err, decoded) => {
			if (err){
				res.json({
					status: false,
					message: 'Failed to authenticate token.'
				})
			} else {
				decoded._id = ObjectId(decoded._id);
				req.session = decoded;
				next();
			}
		});
	}else{
		res.json({
			status: false,
			message: 'No token provided.'
		})
	}
};
