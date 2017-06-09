/**
 * Created by Administrator on 2017/5/11 0011.
 */
var mongoose=require('mongoose');
var contentsSchema=require('../schemas/contents');
module.exports=mongoose.model('Content',contentsSchema);