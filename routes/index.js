const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const niv = require('../app_modules/node-input-validator');

//Models
const User = require('../models/user/User');

/* GET home page. */
router.get('/', (req, res, next) => {
	res.render('index', { title: 'Express' });
});

router.post('/register',async (req, res) => {
	const { username, password } = req.body;
	const v = new niv.Validator(req.body, {
		username: 'required|string|minLength:3|maxLength:12|unique:users,username',
		password: 'required|string|minLength:6|maxLength:12'
	});
	let matched = await v.check();
	if (!matched) return res.status(422).json(v.errors);

	bcrypt.hash(password, 10).then((hash) => {
		const user = new User({
			username,
			password: hash
		});

		const promise = user.save();
		promise.then((data) => {
			res.json(data)
		}).catch((err) => {
			res.json(err);
		})
	});
});

router.post('/authenticate', async (req, res) => {
	const { username, password } = req.body;
	const v = new Validator(req.body, {
		username: 'required|string|minLength:3|maxLength:12',
		password: 'required|string|minLength:6|maxLength:12'
	});
	let matched = await v.check();
	if (!matched) return res.status(422).json(v.errors);

	User.findOne({
		username
	}, (err, user) => {
		if (err)
			throw err;

		if (!user) {
			res.status(404).json({ error: 'Authentication failed, user not found.' });
		} else {
			bcrypt.compare(password, user.password).then((result) => {
				if (!result) {
					res.status(412).json({ message: 'Authentication failed, wrong password.' });
				} else {
					let _id = user._id;
					const payload = {
						username, _id
					};
					const token = jwt.sign(payload, req.app.get('api_secret_key'), {
						expiresIn: "2 days"
					});

					res.json({
						status: true,
						token
					})
				}
			});
		}
	});

});

module.exports = router;
