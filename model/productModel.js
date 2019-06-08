const mongoose=require('mongoose');
const config=require('./../config');
mongoose.connect(config.mongodb,{useNewUrlParser:true});
const ProductSchema=new mongoose.Schema({
    name:String,//名称
    specification:String,//规格
    unit:String,//单位
    category:String,//类别
    remark:String//备注
});
const Product=mongoose.model('Product',ProductSchema);
module.exports=Product;