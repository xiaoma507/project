/**
 * Created by Administrator on 2017/5/9 0009.
 */
var Express = require('express');
var Router = Express.Router();
var User = require('../models/User');
var Category = require('../models/Category');
var Content = require('../models/Content');
Router.use(function (req, res, next) {
	if (!req.userInfo.isAdmin) {
		res.send('对不起，只有管理员才可以登录后台管理');
		return;
	}
	next();
})
/*
 * 首页内容
 * */
Router.get('/', function (req, res, next) {
	res.render('admin/index', {
		userInfo: req.userInfo
	});
});
/*
 * 用户管理
 * */

Router.get('/user', function (req, res, next) {
	//读取数据库所有用户数据
	/*
	 * limit(number):限制获取的数据条数
	 * skip(5):忽略数据的条数
	 * */
	var page = Number(req.query.page || 1);
	var limit = 5;
	var pages = 0;
	User.count().then(function (count) {
		//总页数
		pages = Math.ceil(count / limit);
		//不能超过pages
		page = Math.min(page, pages);
		//page不能小于1
		page = Math.max(page, 1);
		var skip = (page - 1) * limit;
		User.find().limit(limit).skip(skip).then(function (users) {
			res.render('admin/user_index', {
				userInfo: req.userInfo,
				users: users,
				pages: pages,
				page: page,
				count: count,
				limit: limit
			})
		})
	})
})

/*
 * 分类管理
 * */
Router.get('/category', function (req, res) {
	//读取数据库所有用户数据
	/*
	 * limit(number):限制获取的数据条数
	 * skip(5):忽略数据的条数
	 * sort({_id:number}) number 1升序 -1降序
	 * */
	var page = Number(req.query.page || 1);
	var limit = 5;
	var pages = 0;
	Category.count().then(function (count) {
		pages = Math.ceil(count / limit);		//总页数
		page = Math.min(page, pages);		//不能超过pages
		page = Math.max(page, 1);		//page不能小于1
		var skip = (page - 1) * limit
		Category.find().sort({_id: 1}).limit(limit).skip(skip).then(function (categories) {
			res.render('admin/category_index', {
				userInfo: req.userInfo,
				categories: categories,
				pages: pages,
				page: page,
				count: count,
				limit: limit
			})
		})
	})
})
/*
 * 添加分类
 * */
Router.get('/category/add', function (req, res) {
	res.render('admin/category_add', {
		userInfo: req.userInfo
	})
})

/*
 * 保存分类
 * */
Router.post('/category/add', function (req, res) {
	var name = req.body.name || "";
	if (name == "") {
		res.render('admin/error', {
			userInfo: req.userInfo,
			message: "名称不能为空"
		});
		return;
	}
	//数据库中是不是有同名称分类
	Category.findOne({
		name: name
	}).then(function (rs) {
		if (rs) {
			//数据库中存在同分类名称
			res.render('admin/error', {
				userInfo: req.userInfo,
				message: '分类已经存在了'
			})
			return Promise.reject();
		} else {
			//数据库不存在该分类
			return new Category({
				name: name
			}).save();
		}
	}).then(function (newcategory) {
		res.render('admin/success', {
			userInfo: req.userInfo,
			message: '分类保存成功',
			url: '/admin/category'
		})
	})
})
/*
 *
 * 修改分类
 * */
Router.get('/category/edit', function (req, res) {
	//获取要修改的分类信息，用表单显示
	var id = req.query.id || '';
	//获取要修改的分类信息
	Category.findOne({
		_id: id
	}).then(function (category) {
		//console.log( category)
		if (!category) {
			res.render('admin/error', {
				userInfo: req.userInfo,
				message: '分类信息不存在'
			});
		} else {
			res.render('admin/category_edit', {
				userInfo: req.userInfo,
				category: category
			});
		}
	})
})

/*
 * 保存修改的分类数据
 * */
Router.post('/category/edit', function (req, res) {
	var id = req.query.id || '';//获取要修改的分类信息id
	var name = req.body.name;//获取post提交过来的名称name
	Category.findOne({//获取要修改的分类信息id
		_id: id
	}).then(function (category) {
		//console.log( category)
		if (!category) {
			res.render('admin/error', {
				userInfo: req.userInfo,
				message: '分类信息不存在'
			});
			return Promise.reject();
		} else {
			//当用户没有做任何修改提交的时候
			if (name == category.name) {
				res.render('admin/success', {
					userInfo: req.userInfo,
					message: '修改成功',
					url: '/admin/category'
				});
				return Promise.reject();
			} else {
				//要修改的分类名称在数据库
				return Category.findOne({
					_id: {$ne: id},
					name: name
				});
			}
		}
	}).then(function (samecategory) {
		if (samecategory) {
			res.render('admin/error', {
				userInfo: req.userInfo,
				message: '数据库中已经存在同名分类'
			});
			return Promise.reject();
		} else {
			return Category.update({
				_id: id
			}, {
				name: name
			});
		}
	}).then(function () {
		res.render('admin/success', {
			userInfo: req.userInfo,
			message: '修改成功',
			url: '/admin/category'
		})
	})
})
/*
 * 删除分类
 * */
Router.get('/category/delete', function (req, res) {
	var id = req.query.id || '';//获取要删除的分类id
	Category.remove({
		_id: id
	}).then(function () {
		res.render('admin/success', {
			userInfo: req.userInfo,
			message: '删除成功',
			url: '/admin/category'
		})
	})
})

////////////////////////////////////////////
/*
 * 内容首页
 * */
Router.get('/content', function (req, res) {
	var page = Number(req.query.page || 1);
	var limit = 5;
	var pages = 0;
	Content.count().then(function (count) {
		pages = Math.ceil(count / limit);		//总页数
		page = Math.min(page, pages);		//不能超过pages
		page = Math.max(page, 1);		//page不能小于1
		var skip = (page - 1) * limit;
		Content.find().sort({_id: -1}).limit(limit).skip(skip).populate(['category','user']).then(function (contents) {
			res.render('admin/content_index', {
				userInfo: req.userInfo,
				contents: contents,
				pages: pages,
				page: page,
				count: count,
				limit: limit
			})
		})
	})
})

/*
 * 添加内容页面
 * */
Router.get('/content/add', function (req, res) {
	Category.find().then(function (categories) {
		res.render('admin/content_add', {
			userInfo: req.userInfo,
			categories: categories
		})
	})
})
/*
 * 内容保存
 * */
Router.post('/content/add', function (req, res) {
	if (req.body.title == '') {
		res.render('admin/error', {
			userInfo: req.userInfo,
			message: '标题不能为空'
		})
		return;
	}
	if (req.body.description == '') {
		res.render('admin/error', {
			userInfo: req.userInfo,
			message: '简介不能为空'
		})
		return;
	}
	if (req.body.content == '') {
		res.render('admin/error', {
			userInfo: req.userInfo,
			message: '内容不能为空'
		})
		return;
	}

/////保存数据到数据库中
	new Content({
		category: req.body.category,
		title: req.body.title,
		description: req.body.description,
		content: req.body.content,
		user:req.userInfo._id.toString()
	}).save().then(function (rs) {
		res.render('admin/success', {
			userInfo: req.userInfo,
			message: '内容保存成功',
			url: '/admin/content'
		})
	})
})
/*
 *修改内容
 * */
Router.get('/content/edit', function (req, res) {
	//获取要修改的分类信息，用表单显示
	var id = req.query.id || '';
	//获取要修改的分类信息
	var categories = [];
	Category.find().then(function (rs) {
		categories = rs;
		return Content.findOne({
			_id: id
		}).populate('category');
	}).then(function (content) {

		if (!content) {
			res.render('admin/error', {
				userInfo: req.userInfo,
				message: '分类信息不存在'
			});
		} else {
			res.render('admin/content_edit', {
				userInfo: req.userInfo,
				categories: categories,
				content: content
			});
		}
	})
})
/*
 * 保存修改的内容
 * */
Router.post('/content/edit', function (req, res) {
	//获取要修改的分类信息，用表单显示
	var id = req.query.id || '';
	if (req.body.title == '') {
		res.render('admin/error', {
			userInfo: req.userInfo,
			message: '标题不能为空'
		})
		return;
	}
	if (req.body.description == '') {
		res.render('admin/error', {
			userInfo: req.userInfo,
			message: '简介不能为空'
		})
		return;
	}
	if (req.body.content == '') {
		res.render('admin/error', {
			userInfo: req.userInfo,
			message: '内容不能为空'
		})
		return;
	}
	Content.update({
		_id: id
	}, {
		category: req.body.category,
		title: req.body.title,
		description: req.body.description,
		content: req.body.content
	}).then(function () {
		res.render('admin/success', {
			userInfo: req.userInfo,
			message: '内容保存成功',
			url: '/admin/content/edit?id=' + id
		})
	})
})
/*
* 删除内容
* */
Router.get('/content/delete',function(req,res){
	var id = req.query.id || '';
	Content.remove({
		_id: id
	}).then(function () {
		res.render('admin/success', {
			userInfo: req.userInfo,
			message: '删除成功',
			url: '/admin/content'
		})
	})
})

module.exports = Router;