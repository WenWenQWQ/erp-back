const mongoose=require('mongoose');
const config=require('./../config');
mongoose.connect(config.mongodb,{useNewUrlParser:true});
const PsOrderListSchema=new mongoose.Schema({
    status:String,//订单状态
    IRmark:String,//订单类别
    orderDate:String,//单据日期
    deliveryDate:String,//交货时间
    trader:String,//交易对象
    operator:String,//经办人
    number:Number,//销售总数
    amount:Number,//销售金额
    discountRate:Number,//优惠率
    discountAmount:Number,//优惠金额
    actualAmount:Number,//总金额
    createDate:String,//单据创建日期
    founderId:String,//单据创建人工号
    founder:String,//单据创建人
    remark:String,//备注
});
const PsOrderList=mongoose.model('PsOrderList',PsOrderListSchema);
module.exports=PsOrderList;