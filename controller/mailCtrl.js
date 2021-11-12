const nodemailer = require('nodemailer');

const send = async (mail,token) => {
	const transpotor = nodemailer.createTransport({
host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "e35243581ca264",
    pass: "b19a56be00bd78"
  }
	});

let html = `<h1>Reset Password Link : </h1><br><h4>valid for 10min</h4><br><a href = "http://127.0.0.1:8000/api/user/reset/${token}"> http://127.0.0.1:8000/api/user/reset/${token} <a>`

	const mailOptions = {
		from : 'resetmail@banao.io',
		to : mail,
		subject : 'Reset Password',
		html : html
	}
	try {
		await transpotor.sendMail(mailOptions);
	} catch(err) {
		console.log(err);
	}
}

module.exports = send;