import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import path from 'path';
const __dirname = path.resolve();

import User from "./models/User.js";
import FoodItem from "./models/FoodItem.js";
import Table from "./models/Table.js";
import Order from "./models/Order.js";

const app = express();
//middleware
app.use(express.json());

//middleware for token checking
// app.use((req,res,next)=>{
//     const {token } = req.query;
//     if (token=="123456"){
//     next();
//     }
//     else{
//         res.json({
//             success:false,
//             message:"Invalid token"
//         })
//     }
// })

// app.get("/test/middleware",(req,res)=>{
//     res.json({
//         success: true,
//         message :"API response"
//     })
// })

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URL,()=>{
     console.log("connected to MongoDB");
})

//API routes starts here

app.post('/signup',async(req,res)=>{
const {name, phone, email, password ,role} = req.body ;

//    if(!name ){
//       return res.json({
//         success: false,
//         message: "Name is required"
//       })
//    }
   //validation to check if all the fields are filled starts here
   const emptyFields =[];

   if (!name) emptyFields.push('name');
   if (!phone) emptyFields.push('phone');
   if (!email) emptyFields.push('email');
   if (!password) emptyFields.push('password');
   if (!role) emptyFields.push('role');

   if(emptyFields.length>0){
    return res.json({
        success:false,
        message:`${emptyFields.join(',')} are required`
    })
   }
   //validation to check if all the fields are filled ends here

   //validation to check if email already exists start here
    const existingUser = await User.findOne({email:email});
    if(existingUser){
        return res.json({
            success:false,
            message:"Email already exists"
        })
    }
   //validation to check if email already exists ends here

   //validation to check if phone already exists start here
   const existingUserPhone =await User.findOne({phone:phone});
   if(existingUserPhone){
    return res.json({
        success:false,
        message:"phone already exists "
    })
   }
   //validation to check if phone already exists ends here



   const user = new User ({
    name:name,
    phone:phone,
    email:email,
    password:password,
    role:role
   })

   const savedUser = await user.save();

   res.json({
    success:true,
    message:"User created successfully",
    data:savedUser
   })
})

app.post('/login',async(req,res)=>{
    const{email,password}= req.body;

    if(!email || !password){
        return res.json({
        success:false,
        message:"Email and password are required "    
        })
    }

    const existingUser= await User.findOne({email:email, password:password});

    if(existingUser){
        return res.json({
            success:true,
            message:"login successful",
            data:existingUser
        })
    }
    else
    {
        return res.json({
            success:false,
            message:"Invalid email or password"
        })
    }
})

app.post('/createFoodItem',async(req,res)=>{
    const {title,description,imgUrl,price,category} =req.body;

    const foodItem =new FoodItem({
        title:title,
        description:description,
        imgUrl:imgUrl,
        price:price,
        category:category
    })

    const savedFooditem =await foodItem.save();

    res.json({
        success:true,
        message:"Food Item created successfully",
        data: savedFooditem
    })
})

//http://localhost:5000/foodItemsByCategory?category=pizza
app.get("/fooditemsByCategory",async(req,res)=>{
    const{category} =req.query;

    const foodItems = await FoodItem.find({
        category:{ $regex:category,$options :'i'}
    })

    res.json({
        success:true,
        message:"food Item fetched successfully",
        data: foodItems
    })
})

//http://localhost:5000/foodItems?title=pizza
app.get("/foodItems",async(req,res)=>{
    const{title} =req.query;

    const foodItems = await FoodItem.find({
        title:{ $regex:title,$options :'i'}
    })

    res.json({
        success:true,
        message:"food Item fetched successfully",
        data: foodItems
    })
})

app.get("/allFoodItems",async(req,res)=>{

    const foodItems = await FoodItem.find( )

    res.json({
        success:true,
        message:"food Item fetched successfully",
        data: foodItems
    })
})


app.post("/createTable",async(req,res)=>{
    const {tableNumber} =req.body;

    const existingTable = await Table.findOne({tableNumber :tableNumber});
    if(existingTable){
        return res.json({
            success:false,
            message: "Table already exists"
        })
    }

    const table = new Table({
        tableNumber :tableNumber ,
        occupied :false
    })

    const savedTable = await table.save();

    res.json({
        success:true,
        message:"Table Created successfully",
        data :savedTable
    })
})

app.post("/bookTable",async (req,res)=>{
    const{tableNumber, userId} =req.body; //userId is ObjectId

    const existingTable = await Table.findOne({
        tableNumber:tableNumber
    })

    if(existingTable && existingTable.occupied){
        return res.json({
            success:false,
            message:"Table already occupied"       
        })
    }

    if(existingTable){
        existingTable.occupied = true,
        existingTable.occupiedBy = userId,
        await existingTable.save();
    }

    res.json({
        success:true,
        message:"Table booked successfully"    
    })
})

app.post("/unbookTable",async(req,res)=>{
    const {tableNumber} =req.body;

    const existingTable = await Table.findOne({
        tableNumber:tableNumber
    }) 

    if(existingTable){
        existingTable.occupied=false;
        existingTable.occupiedBy=null;
        await existingTable.save();
    }

    res.json({
        success:true,
        message:"table unbooked successfully",
        data :existingTable
    })
})

app.get("/availableTables",async (req,res)=>{
    const availableTables = await Table.find({occupied:false});

    res.json({
        success:true,
        message:"Availabel tables fetched successfully",
        data:availableTables
    })
})

app.post("/orderFoodItems",async(req,res)=>{
    const {userId , tableNumber , items}= req.body;

    const totalOrders= await Order.countDocuments();
    const orderId = totalOrders+1;

    const order = new Order ({
       orderId : orderId,
       userId : userId ,
       tableNumber : tableNumber,
       items :items
    })

    const savedOrder = await order.save();

    res.json({
        success:true,
        message:"Order placed successfully",
        data: savedOrder
    })
})

app.get("/order",async(req,res)=>{
    const {orderId} = req.query;

    const order = await Order.findOne({orderId:orderId});

    res.json({
        success:true,
        Message:"Order Fetched successfully ",
        data:order
    })
})

app.get("/ordersByUserId",async(req,res)=>{
    const {userId} = req.query;

    const orders= await Order.findOne({userId:userId});

    res.json({
        success:true,
        Message:"Order Fetched successfully ",
        data:orders
    })
})

//send request to frontend

//API routes ends here

app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'))
  });


app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
})