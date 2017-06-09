/**
 * Created by Administrator on 2017/5/9 0009.
 */
//加载express 模块
var express = require('express');

//加载模板处理模块
var swig = require('swig');

//加载数据库模块
var mongoose = require('mongoose');

//处理post请求数据模块
var bodyParser = require('body-parser');

//加载cookies模块
var Cookies = require('cookies');

var User = require('./models/User');

//创建app应用
var app = express();

//设置静态文件托管
app.use('/public', express.static(__dirname + '/public'));

//配置模板文件
//定义当前应用的模板引擎
//第一个参数是模板引擎的名称，同时也是模板文件的后缀。第二个参数用于解析处理模板内容的方法
app.engine('html', swig.renderFile);

//设置模板引擎存放目录 第一个参数必须是views,第二个参数是存放模板引擎的路径
app.set('views', './views');
//注册使用模板引擎 的一个参数是view engine 第二个参数是模板引擎的名称html
app.set('view engine', 'html');

//设置bodyParser
app.use(bodyParser.urlencoded({extended: true}));

//设置cookies
app.use(function (req, res, next) {

	//解析登录用户的Cookies信息
	req.cookies = new Cookies(req, res);
	req.userInfo = {};
	if (req.cookies.get('userInfo')) {
		try {
			req.userInfo = JSON.parse(req.cookies.get('userInfo'));
			//获取当前登录用户信息的类型 是不是管理员
			User.findById(req.userInfo._id).then(function (userInfo) {
				req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
				next();
			})
		} catch (e) {
			next();
		}
	} else {
		next();
	}
})

//在开发过程中需要取消缓存
swig.setDefaults({cache: false});

//根据不同功能划分模块
app.use('/admin', require('./routers/admin'));
app.use('/api', require('./routers/api'));
app.use('/', require('./routers/main'));

//连接数据库//监听http请求
mongoose.connect('mongodb://localhost:27017/blog', function (err) {
	if (err) {
		console.log('数据库连接失败')
	} else {
		console.log('数据库连接成功')
		app.listen(8081);
	}
});

//用户发送http请求-->url-->解析路由-->找到匹配规则-->执行对应绑定函数 返回对应内容到用户
// '/public'--静态文件--直接读取制定目录下的文件--返回给用户
// '/'--动态--处理业务逻辑，加载模板，解析模板--返回数据给用户