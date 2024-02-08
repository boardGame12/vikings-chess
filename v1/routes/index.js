import express from "express";
import Auth from './auth.js';
import { Verify } from "../middleware/validate.js";
import  {VerifyRole}  from "../middleware/validate.js";
//import path from 'path';



const app = express();

app.use('/v1/auth', Auth);

app.disable("x-powered-by")

app.get("/v1",(req,res)=>{
    try{
        res.status(200).json({
            status:"success",
            data:[],
            message:"Welcome to our API homepage",
        });
    } catch(err){
        res.status(500).json({
            status:"error",
            message:"Internal Server Error IDEX ERROR",
        });
    }
});



app.get('/v1/admin', Verify, VerifyRole, (req, res) => {
    res.status(200).json({
        status: "Success",
        messsage: "Welcome to the Admin Portal!",
    });
 });



 app.get("v1/user", Verify, (req, res) => {
    res.status(200).json({  
        status: "success",
        message: "Welcome to your Dashboard!",
        user_name: req.user_name 
    });
});


export default app;