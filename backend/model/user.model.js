import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

const userSchema = new mongoose(
    {
        name:{
            type:String,
            required:[true,"name is required"],
        },
        email:{
            type:String,
            required:[true,"email is required"],
            unique:true,
            lowercase:true,
            trim:true,
        },
        password:{
            type:String,
            required:[true,"password is required"],
            minlength:[6,"password must be 6 charecters long"],
        },
        cartItems:[{
            quantity:{
                type:Number,
                default:1,
            },
            product:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Product",//capital P
            }
        }],
        role:{
            typr:String,
            enum:["customer","admin"],
            default:"customer",
        },
    },
    {
        timestamps:true,
    }
)