const Post = require('../model/post.model');
const User = require('../model/user.model');
const Comment = require('../model/comments.model')

const AppError = require('../utils/AppError');

exports.addPost = async (req,res,next) => {
	try {
		const post = {...req.body , postedUser : req.user._id};
		const newPost = await Post.create(post);

		res.status(201).json({
			status : 'success',
			data : {
				newPost
			}
		});
	} catch(err) {
		return next(err);
	}
}

exports.getAllPost = async (req,res,next) => {
	const posts = await Post.find();

	res.status(200).json({
		status : 'success',
		data : {
			no_of_posts : posts.length,
			posts
		}
	});
}

exports.myPosts = async (req,res,next) => {
	const posts = await Post.find({postedUser : req.user._id});

	res.status(200).json({
		status : 'success',
		data : {
			no_of_posts : posts.length,
			posts
		}
	});
}

exports.getPostsFromUser = async (req,res,next) => {
	try {
		const id = req.params.id;

		const posts = await Post.find({postedUser : id});

		res.status(200).json({
			status : 'success',
			data : {
				no_of_posts : posts.length,
				posts
			}
		});
	} catch(err) {
		return next(err);
	}
}

exports.getPostById = async (req,res,next) => {
	try {
		const post = await Post.findById(req.params.id);

		if(!post)
			return next(new AppError('no post found with this Id',404));

		res.status(200).json({
			status : 'success',
			data : {
				post
			}
		});
	} catch(err) {
		return next(err);
	}
}

exports.updatePost = async (req,res,next) => {
	try {
		if(req.body.likes)
			delete req.body.likes;

		const checkPost = await Post.findOne({postedUser : req.user._id , _id : req.params.id});

		if(!checkPost) 
			return next(new AppError('user has no post with this Id',404));

		const updatedPost = await Post.findOneAndUpdate({_id : req.params.id},req.body,{
			new : true,
			runValidators : true
		});

		res.status(200).json({
			status : 'success',
			data : {
				updatedPost
			}
		});
	} catch(err) {
		return next(err);
	}
}

exports.likePost = async (req,res,next) => {
	try {
		const checklike = await User.findOne({ _id :req.user._id });

		if(checklike.likedPost.length)
		{
			for(let i= 0;i<checklike.likedPost.length;++i)
			{
				if(checklike.likedPost[i] == req.params.id)
					return next(new AppError('user already liked the post',409));
			}
		}

		const likedPost = await Post.findByIdAndUpdate(req.params.id,{$inc : { likes : 1}});

		const updateUserLike = await User.findByIdAndUpdate(req.user._id,{$push : {likedPost : req.params.id}}) 

		res.status(200).json({
			status : 'success',
			message : 'post liked'
		});
	} catch(err) {
		return next(err);
	}
}

exports.deletePost = async (req,res,next) => {

	const checkPost = await Post.findOne({postedUser : req.user._id , _id : req.params.id});

	if(!checkPost) 
		return next(new AppError('user has no post with this Id',404));

	const deletedPost = await Post.findByIdAndDelete(req.params.id);

	const deleteCommets = await Comment.deleteMany({forPost : req.params.id});

	res.status(200).json({
		status : 'success',
		message : 'post and comments for the post has been deleted'
	})
}