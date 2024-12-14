import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        //owner of this order.
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
        },

        //product
        products:[
            {
                product:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:"Product",
                    required:true,
                },
                quantity:{
                    type:Number,
                    required:true,
                    min:1,
                },
                price:{
                    type:Number,
                    required:true,
                    min:0,
                }
            }
        ],
        totalAmount : {
            type:Number,
            required:true,
            min:0,
        },
        stripeSessionID:{
            type:String,
            unique:true,
        },
    },
    {timestamps:true}
);

const Order = mongoose.model("Order",orderSchema);

export default Order;


//!--------------- DEMO DATA -----------------
//* {
//*   "_id": "6483a1bc1234567890abcdef",
//*   "user": "6482f1234567890abcde1234",
//*   "products": [
//*     {
//*       "product": "6482f7890123456789abcdef",
//*       "quantity": 2,
//*       "price": 150
//*     },
//*     {
//*       "product": "6482f4561234567890abcde2",
//*       "quantity": 1,
//*       "price": 300
//*     }
//*   ],
//*   "totalAmount": 600,
//*   "stripeSessionId": "sess_ABC123XYZ456",
//*   "createdAt": "2024-12-06T10:23:45.000Z",
//*   "updatedAt": "2024-12-06T10:23:45.000Z"
//* }
