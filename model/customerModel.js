const mongoose=require('mongoose');
const config=require('./../config');
mongoose.connect(config.mongodb,{useNewUrlParser:true});
const CustomerSchema=new mongoose.Schema({
    name:String,//客户名称
    grade:String,//客户等级（批发，零售）
    contact:String,//联系人
    tel:String,//客户电话
    email:String,//邮箱
    address:String,//地址
    remark:String//备注
});
const Customer=mongoose.model('Customer',CustomerSchema);
module.exports=Customer;