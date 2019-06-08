const mongoose=require('mongoose');
const config=require('./../config');
mongoose.connect(config.mongodb,{useNewUrlParser:true});
const PurRefundListSchema=new mongoose.Schema({
    orderDate:String,//单据日期
    refundDate:String,//退货日期
    orderId:String,//关联采购订单
    supplier:String,//供应商
    buyer:String,//退货人员
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
const PurRefundList=mongoose.model('PurRefundList',PurRefundListSchema);
module.exports=PurRefundList;