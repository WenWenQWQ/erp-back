const mongoose=require('mongoose');
const config=require('./../config');
mongoose.connect(config.mongodb,{useNewUrlParser:true});
//仓库
const WarehouseSchema=new mongoose.Schema({
    name:String,//仓库名称
    address:String,//仓库地址
    director:String,//负责人
    tel:String, //电话
    remark:String //备注
});
const Warehouse=mongoose.model('Warehouse',WarehouseSchema);
module.exports=Warehouse;