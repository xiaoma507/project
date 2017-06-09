/**
 * Created by Administrator on 2017/5/9 0009.
 */
var Express = require('express');
var Router = Express.Router();
var Category = require('../models/Category');
var Content = require('../models/Content');
var data;
/*
 * 处理通用数据
 * */
Router.use(function (req, res, next) {
	data = {
		userInfo: req.userInfo,
		categories: []
	}
	Category.find().sort({_id: 1}).then(function (categories) {
		data.categories = categories;
		next();
	})
})

/*
 * 首页
 * */
Router.get('/', function (req, res, next) {
	data.category = req.query.category || "";
	data.count = 0;
	data.page = Number(req.query.page || 1);
	data.limit = 5;
	data.pages = 0;
	var where = {};
	if (data.category) {
		where.category = data.category;
	}
	Content.where(where).count().then(function (count) {
		data.count = count;
		data.pages = Math.ceil(data.count / data.limit);		//总页数
		data.page = Math.min(data.page, data.pages);		//不能超过pages
		data.page = Math.max(data.page, 1);		//page不能小于1
		var skip = (data.page - 1) * data.limit;
		return Content.where(where).find().sort({_id: -1}).limit(data.limit).skip(skip).populate(['category', 'user']);
	}).then(function (contents) {
		data.contents = contents;
		res.render('main/index', data)
	})
});

Router.get('/view', function (req, res) {
	var contentid = req.query.contentid || '';
	Content.findOne({
		_id: contentid
	}).then(function (content) {
		data.content = content;
		content.views++;
		content.save();
		res.render('main/view', data)
	})
})

module.exports = Router;