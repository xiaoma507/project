/**
 * Created by Administrator on 2017/5/9 0009.
 */
var Express = require('express');
var Router = Express.Router();
var User = require('../models/User');
var Content = require('../models/Content');
/*
 * 用户注册返回统一格式
 * */
var responseData;
Router.use(function (req, res, next) {
	responseData = {
		code: 0,
		message: ' '
	}
	next();
})
/*
 * 用户注册处理
 * */
Router.post('/user/register', function (req, res, next) {
	var username = req.body.username;
	var password = req.body.password;
	var repassword = req.body.repassword;

	//用户为空
	if (username == "") {
		responseData.code = 1;
		responseData.message = "用户名不能为空";
		res.json(responseData);
		return;
	}

	//密码不能为空
	if (password == "") {
		responseData.code = 2;
		responseData.message = "密码不能为空";
		res.json(responseData);
		return;
	}
	//两次输入的密码不一致
	if (password != repassword) {
		responseData.code = 3;
		responseData.message = "两次输入的密码不一致";
		res.json(responseData);
		return;
	}

	//注册新用户名与数据库的已有用户名相同的处理
	User.findOne({
		username: username
	}).then(function (userInfo) {

		//如果数据库中有记录
		if (userInfo) {
			responseData.code = 4;
			responseData.message = '用户名已经注册';
			res.json(responseData);
			return;
		}

		//保存用户注册信息
		var newuser = new User({
			username: username,
			password: password
		});
		return newuser.save();
	}).then(function (newuserInfo) {
		responseData.message = "注册成功";
		res.json(responseData);
	})
});
/*
 * 用户登录处理逻辑
 * */
Router.post('/user/login', function (req, res, next) {
	var username = req.body.username;
	var password = req.body.password;
	if (username == "" || password == "") {
		responseData.code = 1;
		responseData.message = '用户名或者密码不能为空';
		res.json(responseData);
		return;
	}

	//查询数据库中有没有相同的记录 如果没有给个code 返回message错误信息 否则登录成功 处理
	User.findOne({
		username: username,
		password: password
	}).then(function (userInfo) {
		if (!userInfo) {
			responseData.code = 2;
			responseData.message = "用户名或者密码错误";
			res.json(responseData);
			return;
		} else {
			//用户名密码正确
			responseData.message = '登录成功';
			responseData.userInfo = {
				_id: userInfo._id,
				username: userInfo.username
			};
			req.cookies.set('userInfo', JSON.stringify({
				_id: userInfo._id,
				username: userInfo.username
			}));
			res.json(responseData);

			return;
		}
	})
})
/*
 * 退出登录
 * */
Router.get('/user/loginout', function (req, res) {
	req.cookies.set('userInfo', null);
	res.json(responseData);

})

/*
 * 获取指定文章的所有评论
 * */
Router.get('/comment', function (req, res) {
	var contentId = req.query.contentid || '';
	Content.findOne({
		_id: contentId
	}).then(function (content) {
		responseData.data = content.comments;
		res.json(responseData);
	})
})
/*
 * 评论提交
 * */
Router.post('/comment/post', function (req, res) {
	//获取内容id
	var contentId = req.body.contentid || '';
	var postData = {
		username: req.userInfo.username,
		postTime: new Date(),
		content: req.body.content
	};
	//查询当前这篇内容的信息
	Content.findOne({
		_id: contentId
	}).then(function (content) {
		content.comments.push(postData);
		return content.save();
	}).then(function (newContent) {
		responseData.message = '评论成功';
		responseData.data = newContent;
		res.json(responseData);
	});
})

module.exports = Router;