const mongoose = require('mongoose');

const validator = require('validator');

const postSchema = new mongoose.Schema({
	image : {
		type : String,
		required : [true,'image is required field']
	},
	title : {
		type : String ,
		required : [true,'title is required field']
	},
	description : {
		type : String,
		required : [true,'description is required field']
	},
	likes : {
		type : Number,
		default : 0
	},
	createdAt : {
		type : Date ,
		default : Date.now()
	},
	updatedAt : {
		type : Date ,
		default : Date.now()
	},
	postedUser : {
		type : mongoose.Schema.ObjectId,
		required : true
	}
});

postSchema.pre('findOneAndUpdate',function (next) {
	this._update.updatedAt = Date.now();
	next();
});

const Post = mongoose.model('post',postSchema);

module.exports = Post;