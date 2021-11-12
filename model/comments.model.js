const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
	comment : {
		type : String,
		required : [true,'comment is required field']
	},
	fromUser : {
		type : mongoose.Schema.ObjectId,
		ref : 'user',
		required : [true,'fromUser is required field']
	},
	forPost : {
		type : mongoose.Schema.ObjectId,
		ref  : 'post',
		required : [true,'forPost is required field']
	}
});

const Comment = mongoose.model('comment',commentSchema);

module.exports = Comment;