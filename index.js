const express = require('express');
const config=require('./config');
const bodyParser=require('body-parser');
const Category=require('./model/categoryModel');
const Product=require('./model/productModel');
const Customer=require('./model/customerModel');
const Warehouse=require('./model/warehouseModel');
const Supplier=require('./model/supplierModel');
const Staff=require('./model/staffModel');
const PurchaseOrderList=require('./model/purchaseOrderListModel');
const OrderDetail=require('./model/orderDetailModel');
const PurHouseList=require('./model/purHouseListModel');
const PurHouseDetail=require('./model/purHouseDetailModel');
const PurRefundList=require('./model/purRefundListModel');
const PurRefundDetail=require('./model/purRefundDetailModel');
const Stock=require('./model/stockModel');
const InventoryOrderList=require('./model/inventoryOrderListModel');
const InventoryOrderDetail=require('./model/inventoryOrderDetailModel');
const SaleOrderList=require('./model/saleOrderListModel');
const SaleOrderDetail=require('./model/saleOrderDetailModel');
const SaleDeliveryList=require('./model/saleDeliveryListModel')
const SaleDeliveryDetail=require('./model/saleDeliveryDetailModel')
const SaleRefundList=require('./model/saleRefundListModel');
const SaleRefundDetail=require('./model/saleRefundDetail');
const session=require('express-session');
const  MongoStore=require('connect-mongo')(session);
const cookieParser=require('cookie-parser');
const app=express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
/*app.get('/',function (req,res) {
    res.send('<h1>Hello World!</h1>')
});*/
app.use(cookieParser());
app.use(session({
    name:'session_id',//cookie的name
    secret:'erp_session_secret',//通过设置的secret字符串，来计算hash值并放在cookie中，使产生的signedCookie防篡改
    cookie:{maxAge:6000000,httpOnly:true},
    store:new MongoStore({url:'mongodb://localhost/Erp'}),
    resave:false,//即使session没有被修改，也保存session值
    saveUninitialized:true //强制未初始化的session保存到数据库
}));
app.all('*',function (req,res,next) {
    res.setHeader('Content-Type','application/json;charset=utf-8');
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
/**
 * 登录
 */
app.post('/signIn',function(req,res){
        let staff=new Staff({
            username:req.body.username,
            password:req.body.password,
        });
        Staff.findOne({
            username:staff.username
        },function (err,data) {
            let message='';
            if(err){
                message='用户查询失败';
                return res.json({tip:message,sign:false});
            }else if(data.length<1){
                message='此用户不存在';
                return res.json({tip:message,sign:false});
            }else{
                if(data.password!==staff.password){
                    message = '密码错误';
                    return res.json({tip: message,sign:false});
                }else if(!data.status){
                    message = '账号被禁用';
                    return res.json({tip: message,sign:false});
                }else{
                    req.session.user=data;
                    message = '登录成功';
                    return res.json({tip: message,sign:true});
                }
            }
        });
});
/**
 * 注册
 */
//注册用户 ，修改用户信息还未完善
app.post('/signUp',function(req,res){
    /*console.log(req.body._id);*/
    if(req.body._id&&req.body._id!==''){
        Staff.find({name:req.body.category},function (err,data) {
            if (data.length >= 1) {
                return res.json({tip: '此类别已经存在'});
            }else{
                Staff.updateOne({
                    _id:req.body._id
                },{
                    name:req.body.category
                },function (err) {
                    let message='';
                    if(err){
                        message='产品分类修改失败';
                    }else {
                        message='产品分类修改成功';
                    }
                    return res.json({tip:message});
                });
            }
        });
    }
    //添加产品分类
    else{
        let staff=new Staff({
            username:req.body.username,
            password:req.body.password,
            name:req.body.name,
            sex:req.body.sex,
            tel:req.body.tel,
            role:req.body.role,
            status:req.body.status
        });
        /*console.log(req.body.category);*/
        Staff.find({
            username:staff.username
        },function (err,data) {
            let message='';
            if(err){
                message='用户查询失败';
                return res.json({tip:message});
            }else if(data.length>=1){
                message='此用户已经存在';
                return res.json({tip:message});
            }else{
                staff.save(function (err) {
                    let message='';
                    if(err){
                        message='新增用户失败';
                    }else{
                        message='新增用户成功';
                    }
                    return res.json({tip:message});
                })
            }

        });
    }
});
//禁用用户
app.post('/basicData/staff/forbidden',function(req,res){
    Staff.updateOne({_id:req.body._id},{
        status:false
        }
    ,function (err) {
        if (!err) {
            return res.json({tip: '禁用成功'});
        }else{
            return res.json({tip: '禁用失败'});
        }
    });
});
//启用用户
app.post('/basicData/staff/Operation',function(req,res){
    Staff.updateOne({_id:req.body._id},{
            status:true
        }
        ,function (err) {
            if (!err) {
                return res.json({tip: '启用成功'});
            }else{
                return res.json({tip: '启用失败'});
            }
        });
});
/**
 * 获取当前用户信息
 */
app.get('/userInfo',function(req,res){
    if(req.session.user){
        return res.json(req.session.user)
    }else{
        return res.json('');
    }
});
//获取员工信息
app.get('/basicData/staff',function(req,res){
    Staff.find(function (err,data) {
        let message='';
        if(err){
            message='员工信息数据查询失败';
            return res.json({tip:message});
        }else{
            return res.json(data);
        }
    });
});
/**
 * 登出
 */
app.get('/signOut',function(req,res){
    req.session.cookie.maxAge=0;
    req.session.destroy(function (err) {
        let message='';
        if(err){
            message = '密码错误';
            return res.json({tip: message});
        }
    });
    return res.json('true');
});
/**
 * 产品分类
 */
//增加，修改产品分类
app.post('/basicData/product/addCate',function(req,res){
    //修改产品分类
    if(req.body._id!==''){
        Category.find({name:req.body.category},function (err,data) {
            if (data.length >= 1) {
                return res.json({tip: '此类别已经存在'});
            }else{
                Category.updateOne({
                    _id:req.body._id
                },{
                    name:req.body.category
                },function (err) {
                    let message='';
                    if(err){
                        message='产品分类修改失败';
                    }else {
                        message='产品分类修改成功';
                    }
                    return res.json({tip:message});
                });
            }
        });
    }
    //添加产品分类
    else{
        let category=new Category({
            name:req.body.category
        });
        /*console.log(req.body.category);*/
        Category.find({
            name:category.name
        },function (err,data) {
            let message='';
            if(err){
                message='产品分类数据查询失败';
                return res.json({tip:message});
            }else if(data.length>=1){
                message='此类别已经存在';
                return res.json({tip:message});
            }else{
                category.save(function (err) {
                    let message='';
                    if(err){
                        message='新增类别失败';
                    }else{
                        message='新增类别成功';
                    }
                    return res.json({tip:message});
                })
            }

        });
    }
});
//查询产品分类
app.get('/basicData/product/category',function(req,res){
    Category.find(function (err,data) {
        let message='';
        if(err){
            message='产品分类数据查询失败';
            return res.json({tip:message});
        }else{
            return res.json(data);
        }
    });
});
//删除产品分类
app.post('/basicData/product/deleteCate',function(req,res) {
    if(req.body._id!==''){
        Category.deleteOne({_id:req.body._id},function(err){
            let message='';
            if(err){
                message='删除产品分类失败';
            }else{
                message='删除产品分类成功';
            }
            return res.json({tip:message});
        })
    }
});
/**
 * 产品
 */
//添加产品
app.post('/basicData/product/addProduct',function(req,res){
    //修改产品分类
    if(req.body._id!==''){
        Product.find({
            name:req.body.name,
            specification:req.body.specification,
            unit:req.body.unit,
            category:req.body.category,
            remark:req.body.remark
        },function (err,data) {
            if (data.length >= 1) {
                return res.json({tip: '此产品相关信息已经存在'});
            }else{
                Product.updateOne({
                    _id:req.body._id
                },{
                    name:req.body.name,
                    specification:req.body.specification,
                    unit:req.body.unit,
                    category:req.body.category,
                    remark:req.body.remark
                },function (err) {
                    let message='';
                    if(err){
                        message='产品信息修改失败';
                    }else {
                        message='产品信息修改成功';
                    }
                    return res.json({tip:message});
                });
            }
        });
    }
    //添加产品分类
    else{
        let product=new Product({
            name:req.body.name,
            specification:req.body.specification,
            unit:req.body.unit,
            category:req.body.category,
            remark:req.body.remark
        });
        Product.find({
            name:req.body.name,
            specification:req.body.specification
        },function (err,data) {
            let message='';
            if(err){
                message='产品数据查询失败';
                return res.json({tip:message});
            }else if(data.length>=1){
                message='此产品已经存在';
                return res.json({tip:message});
            }else{
                product.save(function (err) {
                    let message='';
                    if(err){
                        message='新增产品失败';
                    }else{
                        message='新增产品成功';
                    }
                    return res.json({tip:message});
                })
            }

        });
    }
});
//查询产品列表
app.get('/basicData/product/list',function(req,res){
    Product.find(function (err,data) {
        let message='';
        if(err){
            message='产品分类数据查询失败';
            return res.json({tip:message});
        }else{
            return res.json(data);
        }
    });
});
//删除产品
app.post('/basicData/product/deleteProduct',function(req,res) {
    if(req.body._id!==''){
        Product.deleteOne({_id:req.body._id},function(err){
            let message='';
            if(err){
                message='删除产品信息失败';
            }else{
                message='删除产品信息成功';
            }
            return res.json({tip:message});
        });
    }else if(req.body.ids.length>0){
        req.body.ids.forEach(function (id) {
            Product.deleteOne({_id:id},function(err){
                let message='';
                if(err){
                    message='删除产品信息失败';
                    return res.json({tip:message});
                }
            });
        });
        return res.json({tip:'批量删除产品信息成功'});
    }
});
/**
 * 客户信息
 */
//增加，修改客户信息
app.post('/basicData/customer/add',function(req,res){
    //修改产品分类
    if(req.body._id!==''){
        Customer.find({
            name:req.body.name,
            grade:req.body.grade,
            contact:req.body.contact,
            tel:req.body.tel,
            email:req.body.email,
            address:req.body.address,
            remark:req.body.remark
        },function (err,data) {
            if (data.length >= 1) {
                return res.json({tip: '此客户信息已经存在'});
            }else{
                Customer.updateOne({
                    _id:req.body._id
                },{
                    name:req.body.name,
                    grade:req.body.grade,
                    contact:req.body.contact,
                    tel:req.body.tel,
                    email:req.body.email,
                    address:req.body.address,
                    remark:req.body.remark
                },function (err) {
                    let message='';
                    if(err){
                        message='客户信息修改失败';
                    }else {
                        message='客户信息修改成功';
                    }
                    return res.json({tip:message});
                });
            }
        });
    }
    //添加产品分类
    else{
        let customer=new Customer({
            name:req.body.name,
            grade:req.body.grade,
            contact:req.body.contact,
            tel:req.body.tel,
            email:req.body.email,
            address:req.body.address,
            remark:req.body.remark
        });
        /*console.log(req.body.category);*/
        Customer.find({
            name:req.body.name,
            grade:req.body.grade,
            contact:req.body.contact,
        },function (err,data) {
            let message='';
            if(err){
                message='客户信息数据查询失败';
                return res.json({tip:message});
            }else if(data.length>=1){
                message='此客户已经存在';
                return res.json({tip:message});
            }else{
                customer.save(function (err) {
                    let message='';
                    if(err){
                        message='新增客户信息失败';
                    }else{
                        message='新增客户信息成功';
                    }
                    return res.json({tip:message});
                })
            }

        });
    }
});
//查询客户信息
app.get('/basicData/customer/list',function(req,res){
    Customer.find(function (err,data) {
        let message='';
        if(err){
            message='产品分类数据查询失败';
            return res.json({tip:message});
        }else{
            return res.json(data);
        }
    });
});
//删除客户信息
app.post('/basicData/customer/delete',function(req,res) {
    if(req.body._id!==''){
        Customer.deleteOne({_id:req.body._id},function(err){
            let message='';
            if(err){
                message='删除客户信息失败';
            }else{
                message='删除客户信息成功';
            }
            return res.json({tip:message});
        });
    }else if(req.body.ids.length>0){
        req.body.ids.forEach(function (id) {
            Customer.deleteOne({_id:id},function(err){
                let message='';
                if(err){
                    message='删除客户信息失败';
                    return res.json({tip:message});
                }
            });
        });
        return res.json({tip:'批量删除客户信息成功'});
    }
});
/**
 * 仓库信息
 */
//增加，修改仓库信息
app.post('/basicData/house/add',function(req,res){
    //修改客户信息
    if(req.body._id!==''){
        Warehouse.find({
            name:req.body.name,
            address:req.body.address,
            director:req.body.director,
            tel:req.body.tel,
            remark:req.body.remark
        },function (err,data) {
            if (data.length >= 1) {
                return res.json({tip: '此仓库信息已经存在'});
            }else{
                Warehouse.updateOne({
                    _id:req.body._id
                },{
                    name:req.body.name,
                    address:req.body.address,
                    director:req.body.director,
                    tel:req.body.tel,
                    remark:req.body.remark
                },function (err) {
                    let message='';
                    if(err){
                        message='仓库信息修改失败';
                    }else {
                        message='仓库信息修改成功';
                    }
                    return res.json({tip:message});
                });
            }
        });
    }
    //添加产品分类
    else{
        let warehouse=new Warehouse({
            name:req.body.name,
            address:req.body.address,
            director:req.body.director,
            tel:req.body.tel,
            remark:req.body.remark
        });
        /*console.log(req.body.category);*/
        Warehouse.find({
            name:req.body.name,
            address:req.body.address,
        },function (err,data) {
            let message='';
            if(err){
                message='仓库信息数据查询失败';
                return res.json({tip:message});
            }else if(data.length>=1){
                message='此仓库已经存在';
                return res.json({tip:message});
            }else{
                warehouse.save(function (err) {
                    let message='';
                    if(err){
                        message='新增仓库信息失败';
                    }else{
                        message='新增仓库信息成功';
                    }
                    return res.json({tip:message});
                })
            }

        });
    }
});
//查询仓库信息
app.get('/basicData/house/list',function(req,res){
    Warehouse.find(function (err,data) {
        let message='';
        if(err){
            message='仓库信息数据查询失败';
            return res.json({tip:message});
        }else{
            return res.json(data);
        }
    });
});
//删除仓库信息
app.post('/basicData/house/delete',function(req,res) {
    if(req.body._id!==''){
        Warehouse.deleteOne({_id:req.body._id},function(err){
            let message='';
            if(err){
                message='删除仓库信息失败';
            }else{
                message='删除仓库信息成功';
            }
            return res.json({tip:message});
        });
    }
});
/**
 * 供应商信息
 */
//增加，修改供应商信息
app.post('/basicData/supplier/add',function(req,res){
    //修改供应商信息
    if(req.body._id!==''){
        Supplier.find({
            name:req.body.name,
            contact:req.body.contact,
            tel:req.body.tel,
            address:req.body.address,
            email:req.body.email,
            remark:req.body.remark
        },function (err,data) {
            if (data.length >= 1) {
                return res.json({tip: '此供应商信息已经存在'});
            }else{
                Supplier.updateOne({
                    _id:req.body._id
                },{
                    name:req.body.name,
                    contact:req.body.contact,
                    tel:req.body.tel,
                    address:req.body.address,
                    email:req.body.email,
                    remark:req.body.remark
                },function (err) {
                    let message='';
                    if(err){
                        message='供应商信息修改失败';
                    }else {
                        message='供应商信息修改成功';
                    }
                    return res.json({tip:message});
                });
            }
        });
    }
    //添加供应商信息
    else{
        let supplier=new Supplier({
            name:req.body.name,
            contact:req.body.contact,
            tel:req.body.tel,
            address:req.body.address,
            email:req.body.email,
            remark:req.body.remark
        });
        /*console.log(req.body.category);*/
        Supplier.find({
            name:req.body.name,
            contact:req.body.contact,
        },function (err,data) {
            let message='';
            if(err){
                message='供应商信息数据查询失败';
                return res.json({tip:message});
            }else if(data.length>=1){
                message='此供应商已经存在';
                return res.json({tip:message});
            }else{
                supplier.save(function (err) {
                    let message='';
                    if(err){
                        message='新增供应商信息失败';
                    }else{
                        message='新增供应商信息成功';
                    }
                    return res.json({tip:message});
                })
            }

        });
    }
});
//查询供应商信息
app.get('/basicData/supplier/list',function(req,res){
    Supplier.find(function (err,data) {
        let message='';
        if(err){
            /*console.log(err);*/
            message='供应商信息数据查询失败';
            return res.json({tip:message});
        }else{
           /* console.log(data)*/
            return res.json(data);
        }
    });
});
//删除供应商信息
app.post('/basicData/supplier/delete',function(req,res) {
    if(req.body._id!==''){
        Supplier.deleteOne({_id:req.body._id},function(err){
            let message='';
            if(err){
                message='删除供应商信息失败';
            }else{
                message='删除供应商信息成功';
            }
            return res.json({tip:message});
        });
    }else if(req.body.ids.length>0){
        req.body.ids.forEach(function (id) {
            Supplier.deleteOne({_id:id},function(err){
                let message='';
                if(err){
                    message='删除供应商信息失败';
                    return res.json({tip:message});
                }
            });
        });
        return res.json({tip:'批量删除客户信息成功'});
    }
});
/**
 * 采购管理
 */
//新增采购订单
app.post('/purchasing/order',function(req,res){
    if(req.body._id&&req.body._id!==''){
        PurchaseOrderList.find({
            _id:req.body._id
        },function (err,data) {
            if (!err) {
                PurchaseOrderList.updateOne({
                    _id:req.body._id
                },{
                    orderDate:req.body.orderDate,
                    deliveryDate:req.body.deliveryDate,
                    supplier:req.body.supplier,
                    buyer:req.body.buyer,
                    IRmark:req.body.IRmark,
                    number:req.body.number,
                    amount:req.body.amount,
                    discountRate:req.body.discountRate,
                    discountAmount:req.body.discountAmount,
                    actualAmount:req.body.actualAmount,
                    createDate:req.body.createDate,
                    founderId:req.body.founderId,
                    founder:req.body.founder,
                    remark:req.body.remark
                },function (err) {
                    let message='';
                    if(err){
                        message='采购订单信息修改失败';
                    }else {
                        message='采购订单信息修改成功';
                    }
                    return res.json({tip:message});
                });
            }
        });
    }
    else{
        let purchaseOrderList=new PurchaseOrderList({
            status:'进行中',
            orderDate:req.body.orderDate,
            deliveryDate:req.body.deliveryDate,
            supplier:req.body.supplier,
            buyer:req.body.buyer,
            IRmark:req.body.IRmark,
            number:req.body.number,
            amount:req.body.amount,
            discountRate:req.body.discountRate,
            discountAmount:req.body.discountAmount,
            actualAmount:req.body.actualAmount,
            createDate:req.body.createDate,
            founderId:req.body.founderId,
            founder:req.body.founder,
            remark:req.body.remark
        });
        purchaseOrderList.save(function (err,data) {
            let message='';
            if(err){
                message='新增采购订单失败';
            }else{
                message='新增采购订单成功';
            }
            return res.json({tip:message,_id:data._id});
        });
    }
});
//采购订单列表
app.get('/purchasing/order/list',function(req,res){
    PurchaseOrderList.find(function (err,data) {
        let message='';
        if(err){
            message='采购订单数据查询失败';
            return res.json({tip:message});
        }else{
           /* console.log(data);*/
            return res.json(data);
        }
    });
});
//获取进行中采购订单
app.get('/purchasing/order/onList',function(req,res){
    PurchaseOrderList.find({
        status:'进行中'
    },function (err,data) {
        let message='';
        if(err){
            message='采购订单数据查询失败';
            return res.json({tip:message});
        }else{
            /* console.log(data);*/
            return res.json(data);
        }
    });
});
//删除采购订单信息
app.post('/purchasing/order/delete',function(req,res) {
    if(req.body._id!==''){
        OrderDetail.deleteMany({
            orderId:{
                _id:req.body._id
            }
        },function (err) {
            if(err){
                return res.json({tip:'删除采购订单明细失败'})
            }else{
                PurchaseOrderList.deleteOne({_id:req.body._id},function(err){
                    let message='';
                    if(err){
                        message='删除采购订单信息失败';
                    }else{
                        message='删除采购订单信息成功';
                    }
                    return res.json({tip:message});
                });
            }
        });
    }else if(req.body.ids.length>0){
        req.body.ids.forEach(function (id) {
            PurchaseOrderList.deleteOne({_id:id},function(err){
                let message='';
                if(err){
                    message='删除采购订单信息失败';
                    return res.json({tip:message});
                }
            });
        });
        return res.json({tip:'批量删除采购订单信息成功'});
    }
});
//订单明细
app.post('/orderDetail',function(req,res){
    let orderDetail=new OrderDetail({
        orderId:req.body.orderId,
        IRmark:req.body.IRmark,
        productId:req.body.productId,
        number:req.body.number,
        price:req.body.price,
        amount:req.body.amount,
        rate:req.body.rate,
        amount_rate:req.body.amount_rate,
    });
    orderDetail.save(function (err,data) {
        return res.json({tip:'success'});
    });
});
//获取采购订单中产品信息
app.post('/purchasing/product/detail',function(req,res){
    //多表联合查询
    OrderDetail.find({
        orderId:req.body._id
    })
        .populate({path:'orderId productId',
            select:'orderDate deliveryDate supplier buyer createDate founderId founder name specification unit category _id'})
        .exec(function (err,data) {
            return res.json(data);
        });
});
//获取采购订单明细
app.get('/reportForm/purchase/detail',function(req,res){
    //多表联合查询
    OrderDetail.find()
        .populate({path:'orderId productId',
            select:'orderDate deliveryDate supplier buyer createDate founderId founder name specification unit category _id'})
        .exec(function (err,data) {
            return res.json(data);
        });
});
//修改采购订单状态
app.post('/purchasing/order/update',function (req,res) {
    PurchaseOrderList.updateOne({
        _id:req.body._id
    },{
        status:'结束'
    },function (err) {
        let message='';
        if(err){
            message='采购订单信息修改失败';
        }else {
            message='采购订单信息修改成功';
        }
        return res.json({tip:message});
    });
})
//新增采购入库
app.post('/purchasing/storage',function(req,res){
    if(req.body._id&&req.body._id!==''){
        PurHouseList.find({
            _id:req.body._id
        },function (err,data) {
            if (!err) {
                PurHouseList.updateOne({
                    _id:req.body._id
                },{
                    storageDate:req.body.storageDate,
                    IRmark:req.body.IRmark,
                    orderId:req.body.orderId,
                    storager:req.body.storager,
                    number:req.body.number,
                    amount:req.body.amount,
                    other:req.body.other,
                    discountRate:req.body.discountRate,
                    discountAmount:req.body.discountAmount,
                    actualAmount:req.body.actualAmount,
                    createDate:req.body.createDate,
                    founderId:req.body.founderId,
                    founder:req.body.founder,
                    remark:req.body.remark
                },function (err) {
                    let message='';
                    if(err){
                        message='采购入库信息修改失败';
                    }else {
                        message='采购入库信息修改成功';
                    }
                    return res.json({tip:message});
                });
            }
        });
    }
    else{
        let purHouseList=new PurHouseList({
            storageDate:req.body.storageDate,
            IRmark:req.body.IRmark,
            orderId:req.body.orderId,
            storager:req.body.storager,
            number:req.body.number,
            amount:req.body.amount,
            other:req.body.other,
            discountRate:req.body.discountRate,
            discountAmount:req.body.discountAmount,
            actualAmount:req.body.actualAmount,
            createDate:req.body.createDate,
            founderId:req.body.founderId,
            founder:req.body.founder,
            remark:req.body.remark
        });
        purHouseList.save(function (err,data) {
            let message='';
            if(err){
                message='新增表单失败';
            }else{
                message='新增表单成功';
            }
            return res.json({tip:message,_id:data._id});
        });
    }
});
//采购入库列表
app.get('/purchasing/storage/list',function(req,res){
    PurHouseList.find({
        IRmark:'采购入库'
    },function (err,data) {
        let message='';
        if(err){
            message='采购入库数据查询失败';
            return res.json({tip:message});
        }else{
            /* console.log(data);*/
            return res.json(data);
        }
    });
});
//采购入库明细
app.post('/houseDetail',function(req,res){
    let purHouseDetail=new PurHouseDetail({
        purHouseId:req.body.purHouseId,
        IRmark:req.body.IRmark,
        productId:req.body.productId,
        warehouse:req.body.warehouse,
        number:req.body.number,
        price:req.body.price,
        amount:req.body.amount,
        rate:req.body.rate,
        amount_rate:req.body.amount_rate,
    });
    purHouseDetail.save(function (err,data) {
        return res.json({tip:'success'});
    });
});
//获取采购入库明细
app.get('/reportForm/purchasing/inventoryDetail',function(req,res){
    //多表联合查询
    PurHouseDetail.find({
        IRmark:'采购入库'
    })
        .populate({path:'purHouseId productId',
            select:'storageDate orderId storager createDate founderId founder name specification unit category _id'})
        .exec(function (err,data) {
            /*console.log(data);*/
            return res.json(data);
        });
});
//新增采购退货
app.post('/purchasing/refund',function(req,res){
    if(req.body._id&&req.body._id!==''){
        PurRefundList.find({
            _id:req.body._id
        },function (err,data) {
            if (!err) {
                PurRefundList.updateOne({
                    _id:req.body._id
                },{
                    orderDate:req.body.orderDate,
                    refundDate:req.body.refundDate,
                    orderId:req.body.orderId,
                    supplier:req.body.supplier,
                    buyer:req.body.buyer,
                    number:req.body.number,
                    amount:req.body.amount,
                    discountRate:req.body.discountRate,
                    discountAmount:req.body.discountAmount,
                    actualAmount:req.body.actualAmount,
                    createDate:req.body.createDate,
                    founderId:req.body.founderId,
                    founder:req.body.founder,
                    remark:req.body.remark
                },function (err) {
                    let message='';
                    if(err){
                        message='采购退货信息修改失败';
                    }else {
                        message='采购退货信息修改成功';
                    }
                    return res.json({tip:message});
                });
            }
        });
    }
    else{
        let purRefundList=new PurRefundList({
            orderDate:req.body.orderDate,
            refundDate:req.body.refundDate,
            orderId:req.body.orderId,
            supplier:req.body.supplier,
            buyer:req.body.buyer,
            number:req.body.number,
            amount:req.body.amount,
            discountRate:req.body.discountRate,
            discountAmount:req.body.discountAmount,
            actualAmount:req.body.actualAmount,
            createDate:req.body.createDate,
            founderId:req.body.founderId,
            founder:req.body.founder,
            remark:req.body.remark
        });
        purRefundList.save(function (err,data) {
            let message='';
            if(err){
                message='新增采购退货失败';
            }else{
                message='新增采购退货成功';
            }
            return res.json({tip:message,_id:data._id});
        });
    }
});
//采购退货明细
app.post('/refundDetail',function(req,res){
    let purRefundDetail=new PurRefundDetail({
        refundId:req.body.refundId,
        IRmark:req.body.IRmark,
        productId:req.body.productId,
        number:req.body.number,
        price:req.body.price,
        amount:req.body.amount,
        rate:req.body.rate,
        amount_rate:req.body.amount_rate,
    });
    purRefundDetail.save(function (err,data) {
        return res.json({tip:'success'});
    });
});
//采购退货列表
app.get('/purchasing/refund/list',function(req,res){
    PurRefundList.find(function (err,data) {
        let message='';
        if(err){
            message='采购退货数据查询失败';
            return res.json({tip:message});
        }else{
            /* console.log(data);*/
            return res.json(data);
        }
    });
});
//获取采购退货明细
app.get('/reportForm/purchase/refundDetail',function(req,res){
    //多表联合查询
    PurRefundDetail.find()
        .populate({path:'refundId productId',
            select:'orderDate refundDate orderId supplier buyer createDate founderId founder name specification unit category _id'})
        .exec(function (err,data) {
            /*console.log(data);*/
            return res.json(data);
        });
});
//添加库存
app.post('/stock',function(req,res){
    Stock.findOne({
        productId:req.body.productId,
        warehouseId:req.body.warehouseId
    },function (err,data) {
        if (data) {
            let snum=0;
            if(req.body.IRmark==='入库')
            {
                snum=parseInt(req.body.number)+parseInt(data.number);
            }else if(req.body.IRmark==='出库')
            {
                snum=parseInt(data.number)-parseInt(req.body.number);
            }
            Stock.updateOne({
                productId:req.body.productId,
                warehouseId:req.body.warehouseId
            },{
                productId:req.body.productId,
                warehouseId:req.body.warehouseId,
                number:snum
            },function (err) {
                let message='';
                if(err){
                    message='采购入库信息修改失败';
                }else {
                    message='采购入库信息修改成功';
                }
                return res.json({tip:message});
            });
        }
        else{
            let stock=new Stock({
                productId:req.body.productId,
                warehouseId:req.body.warehouseId,
                number:req.body.number
            });
            stock.save(function (err,data) {
               return res.json({tip:'success'});
            });
        }
    });
});
//查询库存余额
app.get('/reportForm/Inventory/stock',function(req,res){
    //多表联合查询
    Stock.find()
        .populate({path:'warehouseId productId',
            select:'address director tel name specification unit category _id'})
        .exec(function (err,data) {
            /*console.log(data);*/
            return res.json(data);
        });
});
/**
 * 库存管理
 */
//盘点
//获取仓库下产品的库存
app.post('/inventory/productStock',function(req,res){
    /*console.log(req.body._id);*/
    //多表联合查询
    Stock.find({
        warehouseId:req.body._id
    })
        .populate({path:'warehouseId productId',
            select:'address director tel name specification unit category _id'})
        .exec(function (err,data) {
            /*console.log(data);*/
            return res.json(data);
        });
});
//新增盘点列表
app.post('/inventory/order',function(req,res){
    let inventoryOrderList=new InventoryOrderList({
        inventoryDate:req.body.inventoryDate,
        warehouse:req.body.warehouse,
        staff:req.body.staff,
        proNumber:req.body.proNumber,
        overage:req.body.overage,
        shortage:req.body.shortage,
        createDate:req.body.createDate,
        founderId:req.body.founderId,
        founder:req.body.founder,
        remark:req.body.remark
    });
    inventoryOrderList.save(function (err,data) {
        let message='';
        if(err){
            message='新增盘点失败';
        }else{
            message='新增盘点成功';
        }
        return res.json({tip:message,_id:data._id});
    });
});
//获取盘点列表
app.get('/inventory/order/list',function(req,res){
    InventoryOrderList.find(function (err,data) {
        let message='';
        if(err){
            message='盘点数据查询失败';
            return res.json({tip:message});
        }else{
            return res.json(data);
        }
    });
});
//存储盘点订单明细
app.post('/inventoryDetail',function(req,res){
    let inventoryOrderDetail=new InventoryOrderDetail({
        orderId:req.body.orderId,
        productId:req.body.productId,
        number:req.body.number,
        realNumber:req.body.realNumber,
        overage:req.body.overage,
        shortage:req.body.shortage,
        remark:req.body.remark,
    });
    inventoryOrderDetail.save(function (err,data) {
        return res.json({tip:'success'});
    });
});
//获取盘点明细
app.get('/reportForm/Inventory/detail',function(req,res){
    InventoryOrderDetail.find()
        .populate({path:'orderId productId',
            select:'inventoryDate warehouse staff createDate founderId founder name specification unit category _id'})
        .exec(function (err,data) {
           /* console.log(data);*/
            return res.json(data);
        });
});
//其他入库
app.get('/inventory/entry/list',function(req,res){
    PurHouseList.find({
        IRmark:'其他入库'
    },function (err,data) {
        let message='';
        if(err){
            message='其他入库数据查询失败';
            return res.json({tip:message});
        }else{
            /* console.log(data);*/
            return res.json(data);
        }
    });
});
//获取其他入库明细
app.get('/reportForm/inventory/entryDetail',function(req,res){
    //多表联合查询
    PurHouseDetail.find({
        IRmark:'其他入库'
    })
        .populate({path:'purHouseId productId',
            select:'storageDate orderId storager createDate founderId founder name specification unit category _id'})
        .exec(function (err,data) {
            /*console.log(data);*/
            return res.json(data);
        });
});
//其他出库
app.get('/inventory/delivery/list',function(req,res){
    SaleDeliveryList.find({
        IRmark:'其他出库'
    },function (err,data) {
        let message='';
        if(err){
            message='其他出库数据查询失败';
            return res.json({tip:message});
        }else{
            /* console.log(data);*/
            return res.json(data);
        }
    });
});
//获取其他出库明细
app.get('/reportForm/inventory/deliveryDetail',function(req,res){
    //多表联合查询
    SaleDeliveryDetail.find({
        IRmark:'其他出库'
    })
        .populate({path:'saleDeliveryId productId',
            select:'deliveryDate orderId manager createDate founderId founder name specification unit category _id'})
        .exec(function (err,data) {
            /*console.log(data);*/
            return res.json(data);
        });
});
/**
 * 销售管理
 */

//销售订单

//新增销售订单
app.post('/sale/order',function(req,res){
    if(req.body._id&&req.body._id!==''){
        SaleOrderList.find({
            _id:req.body._id
        },function (err,data) {
            if (!err) {
                SaleOrderList.updateOne({
                    _id:req.body._id
                },{
                    orderDate:req.body.orderDate,
                    deliveryDate:req.body.deliveryDate,
                    customer:req.body.customer,
                    salesmen:req.body.salesmen,
                    number:req.body.number,
                    amount:req.body.amount,
                    discountRate:req.body.discountRate,
                    discountAmount:req.body.discountAmount,
                    actualAmount:req.body.actualAmount,
                    createDate:req.body.createDate,
                    founderId:req.body.founderId,
                    founder:req.body.founder,
                    remark:req.body.remark
                },function (err) {
                    let message='';
                    if(err){
                        message='销售订单信息修改失败';
                    }else {
                        message='销售订单信息修改成功';
                    }
                    return res.json({tip:message});
                });
            }
        });
    }
    else{
        let saleOrderList=new SaleOrderList({
            status:'进行中',
            orderDate:req.body.orderDate,
            deliveryDate:req.body.deliveryDate,
            customer:req.body.customer,
            salesmen:req.body.salesmen,
            number:req.body.number,
            amount:req.body.amount,
            discountRate:req.body.discountRate,
            discountAmount:req.body.discountAmount,
            actualAmount:req.body.actualAmount,
            createDate:req.body.createDate,
            founderId:req.body.founderId,
            founder:req.body.founder,
            remark:req.body.remark
        });
        saleOrderList.save(function (err,data) {
            let message='';
            if(err){
                message='新增销售订单失败';
            }else{
                message='新增销售订单成功';
            }
            return res.json({tip:message,_id:data._id});
        });
    }
});
//获取销售订单列表
app.get('/sale/order/list',function(req,res){
    SaleOrderList.find(function (err,data) {
        let message='';
        if(err){
            message='销售订单数据查询失败';
            return res.json({tip:message});
        }else{
            /* console.log(data);*/
            return res.json(data);
        }
    });
});
//获取进行中销售订单
app.get('/sale/order/onList',function(req,res){
    SaleOrderList.find({
        status:'进行中'
    },function (err,data) {
        let message='';
        if(err){
            message='销售订单数据查询失败';
            return res.json({tip:message});
        }else{
            /* console.log(data);*/
            return res.json(data);
        }
    });
});
//添加销售订单明细
app.post('/saleOrderDetail',function(req,res){
    let saleOrderDetail=new SaleOrderDetail({
        orderId:req.body.orderId,
        IRmark:req.body.IRmark,
        productId:req.body.productId,
        warehouse:req.body.warehouse,
        warehouseId:req.body.warehouseId,
        number:req.body.number,
        price:req.body.price,
        amount:req.body.amount,
        rate:req.body.rate,
        amount_rate:req.body.amount_rate,
    });
    saleOrderDetail.save(function (err,data) {
        return res.json({tip:'success'});
    });
});
//获取销售订单明细
app.get('/reportForm/sale/detail',function(req,res){
    //多表联合查询
    SaleOrderDetail.find()
        .populate({path:'orderId productId',
            select:'orderDate deliveryDate customer salesmen createDate founderId founder name specification unit category _id'})
        .exec(function (err,data) {
            return res.json(data);
        });
});

//销售出库

//根据销售订单编号获取产品信息
app.post('/sale/product/detail',function(req,res){
    //多表联合查询
    SaleOrderDetail.find({
        orderId:req.body._id
    })
        .populate({path:'orderId productId',
            select:'orderDate deliveryDate customer salesmen createDate founderId founder name specification unit category _id'})
        .exec(function (err,data) {
            /*console.log(data);*/
            return res.json(data);
        });
});
//新增销售出库
app.post('/sale/delivery',function(req,res){
    if(req.body._id&&req.body._id!==''){
        SaleDeliveryList.find({
            _id:req.body._id
        },function (err,data) {
            if (!err) {
                SaleDeliveryList.updateOne({
                    _id:req.body._id
                },{
                    deliveryDate:req.body.deliveryDate,
                    IRmark:req.body.IRmark,
                    orderId:req.body.orderId,
                    manager:req.body.manager,
                    number:req.body.number,
                    amount:req.body.amount,
                    other:req.body.other,
                    discountRate:req.body.discountRate,
                    discountAmount:req.body.discountAmount,
                    actualAmount:req.body.actualAmount,
                    createDate:req.body.createDate,
                    founderId:req.body.founderId,
                    founder:req.body.founder,
                    remark:req.body.remark
                },function (err) {
                    let message='';
                    if(err){
                        message='销售出库信息修改失败';
                    }else {
                        message='销售出库信息修改成功';
                    }
                    return res.json({tip:message});
                });
            }
        });
    }
    else{
        let saleDeliveryList=new SaleDeliveryList({
            deliveryDate:req.body.deliveryDate,
            IRmark:req.body.IRmark,
            orderId:req.body.orderId,
            manager:req.body.manager,
            number:req.body.number,
            amount:req.body.amount,
            other:req.body.other,
            discountRate:req.body.discountRate,
            discountAmount:req.body.discountAmount,
            actualAmount:req.body.actualAmount,
            createDate:req.body.createDate,
            founderId:req.body.founderId,
            founder:req.body.founder,
            remark:req.body.remark
        });
        saleDeliveryList.save(function (err,data) {
            let message='';
            if(err){
                message='新增表单失败';
            }else{
                message='新增表单成功';
            }
            return res.json({tip:message,_id:data._id});
        });
    }
});
//获取销售出库列表
app.get('/sale/delivery/list',function(req,res){
    SaleDeliveryList.find({
        IRmark:'销售出库'
    },function (err,data) {
        let message='';
        if(err){
            message='销售出库数据查询失败';
            return res.json({tip:message});
        }else{
            /* console.log(data);*/
            return res.json(data);
        }
    });
})
//销售出库明细
app.post('/deliveryDetail',function(req,res){
    let saleDeliveryDetail=new SaleDeliveryDetail({
        saleDeliveryId:req.body.saleDeliveryId,
        IRmark:req.body.IRmark,
        productId:req.body.productId,
        warehouse:req.body.warehouse,
        number:req.body.number,
        price:req.body.price,
        amount:req.body.amount,
        rate:req.body.rate,
        amount_rate:req.body.amount_rate,
    });
    saleDeliveryDetail.save(function (err,data) {
        return res.json({tip:'success'});
    });
});
//获取销售出库明细
app.get('/reportForm/sale/deliveryDetail',function(req,res){
    //多表联合查询
    SaleDeliveryDetail.find({
        IRmark:'销售出库'
    })
        .populate({path:'saleDeliveryId productId',
            select:'deliveryDate orderId manager createDate founderId founder name specification unit category _id'})
        .exec(function (err,data) {
            return res.json(data);
        });
});
//修改采购订单状态
app.post('/sale/order/update',function (req,res) {
    SaleOrderList.updateOne({
        _id:req.body._id
    },{
        status:'结束'
    },function (err) {
        let message='';
        if(err){
            message='销售订单信息修改失败';
        }else {
            message='销售订单信息修改成功';
        }
        return res.json({tip:message});
    });
});
//根据销售出库单编号获取产品出库信息
app.post('/sale/product/deliveryDetail',function(req,res){
    //多表联合查询
    SaleDeliveryDetail.find({
        saleDeliveryId:req.body._id
    })
        .populate({path:'saleDeliveryId productId',
            select:'deliveryDate orderId manager createDate founderId founder name specification unit category _id'})
        .exec(function (err,data) {
            return res.json(data);
        });
});

//销售退货

//新增销售退货
app.post('/sale/refund',function(req,res){
    if(req.body._id&&req.body._id!==''){
        SaleRefundList.find({
            _id:req.body._id
        },function (err,data) {
            if (!err) {
                SaleRefundList.updateOne({
                    _id:req.body._id
                },{
                    refundDate:req.body.refundDate,
                    saleDeliveryId:req.body.saleDeliveryId,
                    salesmen:req.body.salesmen,
                    number:req.body.number,
                    amount:req.body.amount,
                    discountRate:req.body.discountRate,
                    discountAmount:req.body.discountAmount,
                    actualAmount:req.body.actualAmount,
                    createDate:req.body.createDate,
                    founderId:req.body.founderId,
                    founder:req.body.founder,
                    remark:req.body.remark
                },function (err) {
                    let message='';
                    if(err){
                        message='采购退货信息修改失败';
                    }else {
                        message='采购退货信息修改成功';
                    }
                    return res.json({tip:message});
                });
            }
        });
    }
    else{
        let saleRefundList=new SaleRefundList({
            refundDate:req.body.refundDate,
            saleDeliveryId:req.body.saleDeliveryId,
            salesmen:req.body.salesmen,
            number:req.body.number,
            amount:req.body.amount,
            discountRate:req.body.discountRate,
            discountAmount:req.body.discountAmount,
            actualAmount:req.body.actualAmount,
            createDate:req.body.createDate,
            founderId:req.body.founderId,
            founder:req.body.founder,
            remark:req.body.remark
        });
        saleRefundList.save(function (err,data) {
            let message='';
            if(err){
                message='新增采购退货失败';
            }else{
                message='新增采购退货成功';
            }
            return res.json({tip:message,_id:data._id});
        });
    }
});
//采购退货明细
app.post('/saleRefundDetail',function(req,res){
    let saleRefundDetail=new SaleRefundDetail({
        refundId:req.body.refundId,
        IRmark:req.body.IRmark,
        productId:req.body.productId,
        warehouse:req.body.warehouse,
        number:req.body.number,
        price:req.body.price,
        amount:req.body.amount,
        rate:req.body.rate,
        amount_rate:req.body.amount_rate,
    });
    saleRefundDetail.save(function (err,data) {
        return res.json({tip:'success'});
    });
});
//采购退货列表
app.get('/sale/refund/list',function(req,res){
    SaleRefundList.find(function (err,data) {
        let message='';
        if(err){
            message='销售退货数据查询失败';
            return res.json({tip:message});
        }else{
            return res.json(data);
        }
    });
});
//获取采购退货明细
app.get('/reportForm/sale/refundDetail',function(req,res){
    //多表联合查询
    SaleRefundDetail.find()
        .populate({path:'refundId productId',
            select:'refundDate saleDeliveryId salesmen createDate founderId founder name specification unit category _id'})
        .exec(function (err,data) {
            return res.json(data);
        });
});
/**
 * 首页
 */
//总库存
app.get('/homePage/stock',function (req,res) {
    //聚合
    Stock.aggregate([
        {$group: {_id: null, total: {$sum: "$number"}}}
    ]).exec(function(err,data){
        if(data.length>0){
            return res.json(data);
        }else{
            return res.json([{total:0}])
        }
    })
});
//一段时间采购数量
app.post('/homePage/purchaseSum',function (req,res) {
    //聚合
    let date=new Date();
    let month=date.getMonth()+1;
    let year=date.getFullYear();
    let query='';
    if(req.body.purMark==='month'){
        if(month<10){
            query=new RegExp( year+'-0'+month+'-');
        } else{
            query=new RegExp( year+'-'+month+'-');
        }
    }else{
        query=new RegExp(year);
    }
    PurchaseOrderList.aggregate([
        {$match:{orderDate:query}},
        {$group: {_id: null, total: {$sum: "$number"}}}
    ]).exec(function(err,data){
      if(data.length>0){
          return res.json(data);
      }else{
          return res.json([{ _id: null, total: 0}])
      }
    })
});
app.post('/homePage/purchaseNum',function (req,res) {
    //聚合
    let date=new Date();
    let month=date.getMonth()+1;
    let year=date.getFullYear();
    let query='';
    if(req.body.purMark==='month'){
        if(month<10){
            query=new RegExp(year+'-0'+month+'-');
        } else{
            query=new RegExp( year+'-'+month+'-');
        }
    }else{
        query=new RegExp(year);
    }
    PurchaseOrderList.aggregate([
        {$match:{orderDate:query}},
        {$group: {_id: null, total: {$sum: 1}}}
    ]).exec(function(err,data){
        /*console.log(data);*/
        if(data.length>0){
            return res.json(data);
        }else{
            return res.json([{ _id: null, total: 0}])
        }
    })
});
//销售数量
app.post('/homePage/saleSum',function (req,res) {
    //聚合
    let date=new Date();
    let month=date.getMonth()+1;
    let year=date.getFullYear();
    let query='';
    if(req.body.saleMark==='month'){
        if(month<10){
            query=new RegExp(year+'-0'+month+'-');
        } else{
            query=new RegExp( year+'-'+month+'-');
        }
    }else{
        query=new RegExp(year);
    }
    SaleOrderList.aggregate([
        {$match:{orderDate:query}},
        {$group: {_id: null, total: {$sum: "$number"}}}
    ]).exec(function(err,data){
        if(data.length>0){
            return res.json(data);
        }else{
            return res.json([{ _id: null, total: 0}])
        }
    })
});
app.post('/homePage/saleNum',function (req,res) {
    //聚合
    let date=new Date();
    let month=date.getMonth()+1;
    let year=date.getFullYear();
    let query='';
    if(req.body.saleMark==='month'){
        if(month<10){
            query=new RegExp(year+'-0'+month+'-');
        } else{
            query=new RegExp( year+'-'+month+'-');
        }
    }else{
        query=new RegExp(year);
    }
    SaleOrderList.aggregate([
        {$match:{orderDate:query}},
        {$group: {_id: null, total: {$sum: 1}}}
    ]).exec(function(err,data){
        if(data.length>0){
            return res.json(data);
        }else{
            return res.json([{ _id: null, total: 0}])
        }
    })
});
//采购12月
app.post('/homePage/purchaseMonth',function (req,res) {
    //聚合

    let date=new Date();
    let year=date.getFullYear();
    let query='';
    /*console.log(req.body.month)*/
    if(req.body.month<10){
        query=new RegExp( year+'-0'+req.body.month+'-');
        /*query=new RegExp('-05-');*/
    } else{
        query=new RegExp( year+'-'+req.body.month+'-');
    }
    PurchaseOrderList.aggregate([
        {$match:{orderDate:query}},
        {$group: {_id: null, total: {$sum: "$number"}}}
    ]).exec(function(err,data){
        /*console.log(data);*/
        if(data.length>0){
            return res.json({month:req.body.month,total:data[0].total})
        }else{
            return res.json({month:req.body.month,total:0})
        }
    });
});
//销售12月
app.post('/homePage/saleMonth',function (req,res) {
    //聚合

    let date=new Date();
    let year=date.getFullYear();
    let query='';
    /*console.log(req.body.month)*/
    if(req.body.month<10){
        query=new RegExp( year+'-0'+req.body.month+'-');
    } else{
        query=new RegExp( year+'-'+req.body.month+'-');
    }
    SaleOrderList.aggregate([
        {$match:{orderDate:query}},
        {$group: {_id: null, total: {$sum: "$number"}}}
    ]).exec(function(err,data){
        if(data.length>0){
            return res.json({month:req.body.month,total:data[0].total});
        }else{
            return res.json({month:req.body.month,total:0})
        }
    });
});
app.listen(config.port,function(){
    console.log("http://localhost:8080")
});