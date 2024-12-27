import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
    {
        code:{
            type:String,
            required:true,
            unique:true,
        },
        discountPercentage:{
            type:Number,
            required:true,
            min:0,
            max:100,
        },
        expirationDate:{
            type:Date,
            required:true,
        },
        isActive:{
            type:Boolean,
            default:true,
        },
        userID:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
            unique:true,
        },
    },{
        timestamps:true,
    }
);

const Coupon = mongoose.model("Coupon",couponSchema);

export default Coupon;


//!----------- DEMO DATA -----------------
//* {
//*  "_id": "6483b2cd1234567890abcdef",
//*  "code": "SUMMER2024",
//*  "discountPercentage": 20,
//*  "expirationDate": "2024-12-31T23:59:59.000Z",
//*  "isActive": true,
//*  "userID": "6482f1234567890abcde1234",
//*  "createdAt": "2024-12-06T12:00:00.000Z",
//*  "updatedAt": "2024-12-06T12:00:00.000Z"
//*}
