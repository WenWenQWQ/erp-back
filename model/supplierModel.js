const mongoose=require('mongoose');
const config=require('./../config');
mongoose.connect(config.mongodb,{useNewUrlParser:true});
//供应商
const SupplierSchema=new mongoose.Schema({
    name:String,//供应商公司名称
    contact:String,//供应商联系人
    tel:String,//电话
    address:String,//地址
    email:String,//邮箱
    remark:String//备注
});
const Supplier=mongoose.model('Supplier',SupplierSchema);
module.exports=Supplier;