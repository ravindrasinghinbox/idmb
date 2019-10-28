const niv = require('node-input-validator');
const mongoose = require('mongoose');

niv.extend('unique', async ({ value, args }) => {
	// default field is email in this example
	const model = args[0];
	const field = args[1] || '_id';
	const skip = args[2];

	try {
		let condition = {};
		condition[field] = value;

		// add ignore condition
		if (skip) condition['_id'] = { $ne: mongoose.Types.ObjectId(skip) };

		let emailExist = await mongoose.model(model).findOne(condition).select(field);
		return emailExist ? false : true;
	} catch (error) {
	}
});

niv.extend('exist', async ({ value, args }) => {
	// default field is email in this example
	const model = args[0];
	const field = args[1] || '_id';
	const cast = args[2];

	try {
		let condition = {};
		condition[field] = cast ? mongoose.Types.ObjectId(value) : value;

		let emailExist = await mongoose.model(model).findOne(condition).select(field);
		return emailExist ? true : false;
	} catch (error) {
	}
});

module.exports = niv;
