/**
 * Created by Administrator on 2017/5/11 0011.
 */
var mongoose=require('mongoose');
var categoriesSchema=require('../schemas/categories');
module.exports=mongoose.model('Category',categoriesSchema);