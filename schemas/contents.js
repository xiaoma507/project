/**
 * Created by Administrator on 2017/5/11 0011.
 */
/**
 * Created by Administrator on 2017/5/9 0009.
 */
var mongoose = require('mongoose');
//文章表结构
module.exports = new mongoose.Schema({

	//关联字段-内容分类的id
	category: {
		//类型
		type: mongoose.Schema.Types.ObjectId,
		//引用
		ref: 'Category'
	},
	//关联字段-用户id
	user: {
		//类型
		type: mongoose.Schema.Types.ObjectId,
		//引用
		ref: 'User'
	},
	//添加时间
	addTime: {
		type: Date,
		default: new Date()
	},
	//阅读量
	views:{
		type:Number,
		default:0
	},
	//内容标题
	title: String,
	//简介
	description: {
		type: String,
		default: ''
	},
	//内容
	content: {
		type: String,
		default: ''
	},
	comments:{
		type:Array,
		default:[]
	}

});