const mongoose=require('mongoose');
const config=require('./../config');
mongoose.connect(config.mongodb,{useNewUrlParser:true});
let CategorySchema=new mongoose.Schema({
    name:String //类别名称
});
let Category=mongoose.model('Category',CategorySchema);
module.exports=Category;