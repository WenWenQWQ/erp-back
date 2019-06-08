const mongoose=require('mongoose');
const config=require('./../config');
mongoose.connect(config.mongodb,{useNewUrlParser:true});
const InventoryOrderListSchema=new mongoose.Schema({
    inventoryDate:String,//盘点日期
    warehouse:String,//仓库
    staff:String,//盘点人员
    proNumber:Number,//盘点产品量
    overage:Number,//盘盈
    shortage:Number,//盘亏
    createDate:String,//单据创建日期
    founderId:String,//单据创建人工号
    founder:String,//单据创建人
    remark:String,//备注
});
const InventoryOrderList=mongoose.model('InventoryOrderList',InventoryOrderListSchema);
module.exports=InventoryOrderList;