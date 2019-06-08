const mongoose=require('mongoose');
const config=require('./../config');
const  Schema = mongoose.Schema;
mongoose.connect(config.mongodb,{useNewUrlParser:true});
const InventoryOrderDetailSchema=new mongoose.Schema({
    orderId:{ type: Schema.ObjectId, ref: 'InventoryOrderList' },//关联订单编号.order
    productId:{ type: Schema.ObjectId, ref: 'Product' },//关联产品
    number:Number,//系统数量
    realNumber:Number,//盘点数量
    overage:Number,//盘盈
    shortage:Number,//盘亏
    remark:Number,//备注
});
const InventoryOrderDetail=mongoose.model('InventoryOrderDetail',InventoryOrderDetailSchema);
module.exports=InventoryOrderDetail;