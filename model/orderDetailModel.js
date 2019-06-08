const mongoose=require('mongoose');
const config=require('./../config');
const  Schema = mongoose.Schema;
mongoose.connect(config.mongodb,{useNewUrlParser:true});
const OrderDetailSchema=new mongoose.Schema({
    orderId:{ type: Schema.ObjectId, ref: 'PurchaseOrderList' },//关联订单编号.order
    IRmark:String,//采购、销售标志
    productId:{ type: Schema.ObjectId, ref: 'Product' },//关联产品
    number:Number,//数量
    price:Number,//单价
    amount:Number,//采购金额
    rate:Number,//税率
    amount_rate:Number,//采购金额（含税）
});
const OrderDetail=mongoose.model('OrderDetail',OrderDetailSchema);
module.exports=OrderDetail;