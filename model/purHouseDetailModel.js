const mongoose=require('mongoose');
const config=require('./../config');
const  Schema = mongoose.Schema;
mongoose.connect(config.mongodb,{useNewUrlParser:true});
const PurHouseDetailSchema=new mongoose.Schema({
    purHouseId:{ type: Schema.ObjectId, ref: 'PurHouseList' },//关联采购入库编号
    IRmark:String,//采购、销售标志
    productId:{ type: Schema.ObjectId, ref: 'Product' },//关联产品
    warehouse:String,//关联仓库
    number:Number,//数量
    price:Number,//单价
    amount:Number,//采购金额
    rate:Number,//税率
    amount_rate:Number,//采购金额（含税）
});
const PurHouseDetail=mongoose.model('PurHouseDetail',PurHouseDetailSchema);
module.exports=PurHouseDetail;