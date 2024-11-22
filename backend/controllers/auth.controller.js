import { redis } from "../lib/redis.js";
import User from "../model/user.model.js";
import jwt from "jsonwebtoken";

//creating function to generate the tokens
const generateToken = (userID) => {
  const accessToken = jwt.sign({ userID }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign({ userID }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

//creating function to store refreshtoken inside redis.
const storeRefreshToken = async(userID,refreshToken)=>{

    // here i am setting userid as key and refreshtoken as value which will be expired in 7days.
    await redis.set(`refresh_token:${userID}`,refreshToken,"EX",7*24*60*60)//7days
}

//setting up cookies for storing accesstoken and refreshtoken
const setCookies = (res,accessToken,refreshToken)=>{

    //res.cookie is an inbuilt method in Express.js used to set cookies on the response object res.cookie(name, value, options)
    res.cookie('accessToken',accessToken,{
        httpOnly:true, // prevent XSS attacks, cross site scripting attack.
        secure:process.env.NODE_ENV === 'production',
        sameSite:"strict",// prevents CSRF attack, cross-site request forgery attack
        maxAge:7*24*60*60*1000 //7days
    });
    res.cookie('refreshToken',refreshToken,{
        httpOnly:true, // prevent XSS attacks, cross site scripting attack.
        secure:process.env.NODE_ENV === 'production',
        sameSite:"strict",// prevents CSRF attack, cross-site request forgery attack
        maxAge:7*24*60*60*1000 //7days
    });
}

export const signup = async (req, res) => {
  //getting data from request body
  try {
    const { email, password, name } = req.body;
    //checking if the user exists.
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400).json({ message: "user already exists" });
    }
    const user = await User.create({ name, email, password });

    //$$$$$$$$$$$Authentication process$$$$$$$$$$$$$$$$.
    
    //getting both the tokens from generate tokens.
    const{accessToken,refreshToken} = generateToken(user._id); 

    //storing token in redis.
    await storeRefreshToken(user._id,refreshToken);

    //setting up cookies.
    setCookies(res,accessToken,refreshToken);

    //sending successfull data 
    res.status(201).json({
        _id:user._id,
        name:user.name,
        email:user.email,
        role:user.role,
        message:'user created successfully'});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  res.send("loginroute called");
};

export const logout = async (req, res) => {
  res.send("logout route called");
};
