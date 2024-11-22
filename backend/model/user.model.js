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

                //Indicates that product will store a reference to another document in the database.
                type:mongoose.Schema.Types.ObjectId,

                //When you use ref: "Product", you are telling Mongoose that the product field in your schema is connected to another collection in the database called "Product". Think of it as a way to link two types of data together.
                ref:"Product",
            }
        }],
        role:{
            type:String,

            //enum ensures that the role can only be "cutomer" or "admin".
            enum:["customer","admin"],
            //by default it will be customer.
            default:"customer",
        },
    },
    {
        timestamps:true,
    }
);

// Mongoose pre-save middleware for a userSchema. This middleware runs before saving a user document in the database.
//Here, the next function is used in the context of Mongoose middleware, which is a bit different from Express middleware, though the naming convention is the same.

// Mongoose Middleware: The next function in Mongoose is used to control the flow of execution in hooks like pre or post on a model. When you call next(), you’re telling Mongoose to continue with the operation (like saving a document).

userSchema.pre('save',async function (next) {

    //this.isModified(field) is a Mongoose method that checks whether the specified field (in this case, "password") has been changed in the current operation. accordingly it returns true or false.
    if(!this.isModified('password')) return next();

    try{
        //genrating hashed passwords.
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password,salt);
        next();
    }catch(error){

        //passing error to the next middleware
        next(error);
    }
});

//creating static method which called by the instance of this useschema model like form user1 or user2
userSchema.methods.comparePassword = async function(password){

    //here the this keyword refers to the user1 or user2 whoever called this methods->user1.comparePassword.
    return bcrypt.compare(password,this.password);
}

const User = mongoose.model("User",userSchema);

export default User;