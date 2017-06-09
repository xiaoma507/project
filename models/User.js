/**
 * Created by Administrator on 2017/5/9 0009.
 */
var mongoose=require('mongoose');
var usersSchema=require('../schemas/users');
module.exports=mongoose.model('User',usersSchema);//第一个参数模型名称 第二个参数是对应的数据表结构