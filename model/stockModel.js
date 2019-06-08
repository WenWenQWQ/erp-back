const mongoose=require('mongoose');
const config=require('./../config');
const  Schema = mongoose.Schema;
mongoose.connect(config.mongodb,{useNewUrlParser:true});
const StockSchema=new mongoose.Schema({
    productId:{ type: Schema.ObjectId, ref: 'Product' },//关联产品
    warehouseId:{ type: Schema.ObjectId, ref: 'Warehouse' },//关联仓库
    number:Number,//库存余额
});
const Stock=mongoose.model('Stock',StockSchema);
module.exports=Stock;