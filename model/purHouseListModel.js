const mongoose=require('mongoose');
const config=require('./../config');
mongoose.connect(config.mongodb,{useNewUrlParser:true});
const PurHouseListSchema=new mongoose.Schema({
    storageDate:String,//入库时间
    IRmark:String,//入库类型
    orderId:String,//采购订单编号
    storager:String,//入库人员
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
const PurHouseList=mongoose.model('PurHouseList',PurHouseListSchema);
module.exports=PurHouseList;