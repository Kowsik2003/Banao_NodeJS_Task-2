const express = require('express');

const postCtrl = require('../controller/postCtrl');
const userCtrl = require('../controller/userCtrl');
const commentCtrl = require('../controller/commentCtrl');


const router = express.Router();

router.route('/')
	.get(userCtrl.protect,postCtrl.getAllPost)
	.post(userCtrl.protect,postCtrl.addPost);

router.route('/mypost')
	.get(userCtrl.protect,postCtrl.myPosts);

router.route('/user/:id')
	.get(userCtrl.protect,postCtrl.getPostsFromUser);

router.route('/:id')
	.patch(userCtrl.protect,postCtrl.updatePost)
	.delete(userCtrl.protect,postCtrl.deletePost)
	.get(userCtrl.protect,postCtrl.getPostById);

router.route('/like/:id')
	.post(userCtrl.protect,postCtrl.likePost);

// Comment Routes

router.route('/comment/:id')
	.post(userCtrl.protect,commentCtrl.commentPost)
	.get(userCtrl.protect,commentCtrl.getCommentForPost);

router.route('/comment/user/:id')
	.get(userCtrl.protect,commentCtrl.getCommentFormUser);


module.exports = router;