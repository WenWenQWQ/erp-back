const mongoose=require('mongoose');
const config=require('./../config');
const  Schema = mongoose.Schema;
mongoose.connect(config.mongodb,{useNewUrlParser:true});
const SaleRefundDetailSchema=new mongoose.Schema({
    refundId:{ type: Schema.ObjectId, ref: 'SaleRefundList' },//关联订单编号.order
    IRmark:String,//采购、销售标志
    productId:{ type: Schema.ObjectId, ref: 'Product' },//关联产品
    warehouse:String,
    warehouseId:{ type: Schema.ObjectId, ref: 'Warehouse' },
    number:Number,//数量
    price:Number,//单价
    amount:Number,//采购金额
    rate:Number,//税率
    amount_rate:Number,//采购金额（含税）
});
const SaleRefundDetail=mongoose.model('SaleRefundDetail',SaleRefundDetailSchema);
module.exports=SaleRefundDetail;