const mongoose=require('mongoose');
const config=require('./../config');
mongoose.connect(config.mongodb,{useNewUrlParser:true});
const SaleDeliveryListSchema=new mongoose.Schema({
    deliveryDate:String,//出库时间
    IRmark:String,//入库类型
    orderId:String,//销售订单编号
    manager:String,//入库人员
    number:Number,//入库总数
    amount:Number,//采购金额
    other:Number,//其他费用
    discountRate:Number,//优惠率
    discountAmount:Number,//优惠金额
    actualAmount:Number,//总金额
    createDate:String,//单据创建日期
    founderId:String,//单据创建人工号
    founder:String,//单据创建人
    remark:String,//备注
});
const SaleDeliveryList=mongoose.model('SaleDeliveryList',SaleDeliveryListSchema);
module.exports=SaleDeliveryList;