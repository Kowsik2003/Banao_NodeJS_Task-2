const User = require('../model/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');
const AppError = require('../utils/AppError');

const sendMail = require('./mailCtrl');

exports.loginUser = async (req,res,next) => {
	try {

		const username = req.body.username, password = req.body.password;

		if(!username || !password)
		{
			return next(new AppError('provide username and password',400));
		}

		const user = await User.findOne({username : username}).select('+password');

		//const test = await (user.checkPassword(password,user.password));
		if(!user || !(await (user.checkPassword(password,user.password))))
		{
			return next(new AppError('username or password is wrong',401));
		}	

		const token = jwt.sign({id : user._id},process.env.JWT_KEY,{
			expiresIn : process.env.JWT_EXPIRESIN
		});

		res.status(200).json({
			status : 'success',
			token
		});
		//console.log(token);
	}	catch (err) {
		return next(err);
	}
}

exports.registerUser = async (req,res,next) => {
	try {
			const newuser = await User.create({
			email : req.body.email,
			username : req.body.username,
			password : req.body.password
			});

			newuser.password = undefined;
			//console.log(req.body);

		const token = jwt.sign({id : newuser._id},process.env.JWT_KEY,{
			expiresIn : process.env.JWT_EXPIRESIN
		});

			res.status(201).json({
				status : 'created',
				data : {
					newuser,token
				}
			});
 		} catch(err) {
 		 return	next(err);
 		}

}

exports.resetmail = async (req,res,next) => {

	const username = req.body.username,email = req.body.email;

	const user = await User.findOne({$or : [{username : username},{email : email}]});

	if(!user)
		return next(new AppError('email or username does not exist !',404));

	const token = await jwt.sign({id : user._id},process.env.JWT_EMAIL_KEY,{
			expiresIn : process.env.JWT_EMAIL_EXPIRE
		});

	await sendMail(user.email,token);

	res.status(200).json({
		status : 'success',
		message : `reset token send to your mail .`
	});
}

exports.resetPassword = async (req,res,next) => {
	const token = req.params.resetToken;
	let user;
	try {
	 	 user = await jwt.verify(token,process.env.JWT_EMAIL_KEY)		
	} catch(err) {return next(err)}

	if(!user.id)
		return next(new AppError('Invalid Token',400));

	const password = req.body.password;

	if(!password)
		return next(new AppError('provide password for reset',400));

	const hash_password = await bcrypt.hash(password,10);

	await User.findByIdAndUpdate(user.id,{password : hash_password})
		.catch(err => {return next(new AppError('User not found',404))});

	res.status(200).json({
		status : 'success',
		message : 'password changed'
	})
}

exports.protect = async (req,res,next) => {
	try {
		const token = req.headers.authorization;

		if(!token)
			return next(new AppError('user not logged In',403));

		const jwtId = await promisify(jwt.verify)(token,process.env.JWT_KEY);

		const jwtUser = await User.findById(jwtId.id);

		if(!jwtUser)
			return next(new AppError('The user does not exist !',404));

		req.user = jwtUser;
		next();
	} catch (err) {
		return next(err);
	}
}