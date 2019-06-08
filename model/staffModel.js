const mongoose=require('mongoose');
const config=require('./../config');
mongoose.connect(config.mongodb,{useNewUrlParser:true});
const StaffSchema=new mongoose.Schema({
    username:String,//用户名
    password:String,//密码
    name:String,//姓名
    sex:String,//性别
    tel:String,//电话
    role:String,//角色
    status:Boolean//用户是否启用
});
const Staff=mongoose.model('Staff',StaffSchema);
module.exports=Staff;