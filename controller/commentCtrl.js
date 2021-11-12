const Comment = require('../model/comments.model');

const AppError = require('../utils/AppError');

exports.commentPost = async (req,res,next) => {
	try {
		const comment = await Comment.create({comment : req.body.comment,fromUser : req.user._id,forPost : req.params.id});

		res.status(200).json({
			status : 'success',
			message : 'comment added successfully'
		});
	} catch(err) {
		return next(err);
	}
}

exports.getCommentForPost = async (req,res,next) => {
	const comments = await Comment.find({forPost : req.params.id});

	if(!comments[0])
		return next(new AppError('no comments for this post',404));

	res.status(200).json({
		status : 'success',
		data : {
			no_of_comments : comments.length,
			comments
		}
	});
}

exports.getCommentFormUser = async (req,res,next) => {
	const comments = await Comment.find({fromUser : req.params.id});

	if(!comments[0])
		return next(new AppError('no comments form this user',404));

	res.status(200).json({
		status : 'success',
		data : {
			no_of_comments : comments.length,
			comments
		}
	});
}
