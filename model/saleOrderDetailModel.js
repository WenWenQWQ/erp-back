const mongoose=require('mongoose');
const config=require('./../config');
const  Schema = mongoose.Schema;
mongoose.connect(config.mongodb,{useNewUrlParser:true});
const SaleOrderDetailSchema=new mongoose.Schema({
    orderId:{ type: Schema.ObjectId, ref: 'SaleOrderList' },//关联订单编号
    IRmark:String,//采购、销售标志
    productId:{ type: Schema.ObjectId, ref: 'Product' },//关联产品
    warehouse:String,
    warehouseId:{ type: Schema.ObjectId, ref: 'Warehouse' },//关联仓库
    number:Number,//数量
    price:Number,//单价
    amount:Number,//金额
    rate:Number,//税率
    amount_rate:Number,//金额（含税）
});
const SaleOrderDetail=mongoose.model('SaleOrderDetail',SaleOrderDetailSchema);
module.exports=SaleOrderDetail;