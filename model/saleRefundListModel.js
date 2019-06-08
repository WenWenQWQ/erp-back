const mongoose=require('mongoose');
const config=require('./../config');
mongoose.connect(config.mongodb,{useNewUrlParser:true});
const SaleRefundListSchema=new mongoose.Schema({
    refundDate:String,//退货日期
    saleDeliveryId:String,//关联出库单编号
    salesmen:String,//销售人员
    number:Number,//退货总数
    amount:Number,//退货金额
    discountRate:Number,//优惠率
    discountAmount:Number,//优惠金额
    actualAmount:Number,//总金额
    createDate:String,//单据创建日期
    founderId:String,//单据创建人工号
    founder:String,//单据创建人
    remark:String,//备注
});
const SaleRefundList=mongoose.model('SaleRefundList',SaleRefundListSchema);
module.exports=SaleRefundList;