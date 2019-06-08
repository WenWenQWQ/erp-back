const mongoose=require('mongoose');
const config=require('./../config');
mongoose.connect(config.mongodb,{useNewUrlParser:true});
const PurchaseOrderListSchema=new mongoose.Schema({
    status:String,//订单状态
    orderDate:String,//单据日期
    deliveryDate:String,//交货时间
    supplier:String,//供应商
    buyer:String,//采购人员
    number:Number,//采购总数
    amount:Number,//采购金额
    discountRate:Number,//优惠率
    discountAmount:Number,//优惠金额
    actualAmount:Number,//总金额
    createDate:String,//单据创建日期
    founderId:String,//单据创建人工号
    founder:String,//单据创建人
    remark:String,//备注
});
const PurchaseOrderList=mongoose.model('PurchaseOrderList',PurchaseOrderListSchema);
module.exports=PurchaseOrderList;