import { redis } from "../lib/redis.js";
import User from "../model/user.model.js";
import jwt, { decode } from "jsonwebtoken";

//*creating function to generate the tokens
const generateToken = (userID) => {
  //*sending  userID  as a payload data
  const accessToken = jwt.sign({ userID }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign({ userID }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

//*creating function to store refreshtoken inside redis.
const storeRefreshToken = async (userID, refreshToken) => {
  //* here i am setting userid as key and refreshtoken as value which will be expired in 7days.
  await redis.set(
    `refresh_token:${userID}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60
  ); //*7days
};


//*setting up cookies for storing accesstoken and refreshtoken
const setCookies = (res, accessToken, refreshToken) => {
  //*res.cookie is an inbuilt method in Express.js used to set cookies on the response object res.cookie(name, value, options)
  //*here we set cookie 'accessToken' casesenstive.
  res.cookie("accessToken", accessToken, {
    httpOnly: true, //* prevent XSS attacks, cross site scripting attack.
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", //* prevents CSRF attack, cross-site request forgery attack
    maxAge: 7 * 24 * 60 * 60 * 1000, //*7days
  });
  //*here we set cookie 'refreshToken' casesenstive.
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true, //* prevent XSS attacks, cross site scripting attack.
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", //* prevents CSRF attack, cross-site request forgery attack
    maxAge: 7 * 24 * 60 * 60 * 1000, //*7days
  });
};

export const signup = async (req, res) => {
  //*getting data from request body
  try {
    const { email, password, name } = req.body;
    //*checking if the user exists.
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400).json({ message: "user already exists" });
    }
    const user = await User.create({ name, email, password });

    //*$$$$$$$$$$$--Authentication process--$$$$$$$$$$$$$$$$.

    //*getting both the tokens from generateToken by calling it generateToken(user._id).
    const { accessToken, refreshToken } = generateToken(user._id);

    //*storing token in redis.
    await storeRefreshToken(user._id, refreshToken);

    //*setting up cookies.
    setCookies(res, accessToken, refreshToken);

    //*sending successfull data
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      message: "user created successfully",
    });
  } catch (error) {
    console.log("error in signup controller :-", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    //*getting user from request_body.
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    //*if there is user and comparePassword is true then exicute <comparePassword> came from userModel.static.
    if (user && user.comparePassword(password)) {
      //*generating tokens.
      const { accessToken, refreshToken } = generateToken(user._id);

      //*storing refresh token in redis.
      await storeRefreshToken(user._id, refreshToken);
      setCookies(res, accessToken, refreshToken);

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(400).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.log("error in login controller :-", error.message);
    res.status(500).json({ message: error.message });
  }
};

//*MOTIVE -> to clear the cookie and also delete the redis key:value also
export const logout = async (req, res) => {
  try {
    //*refreshToken came from cookie.
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      //*cookie-payload data getstored into the decoded.
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );

      //*here deleting the key:value inside redis NOTE :- `refresh_token:${decoded.userID}` should match with you key
      await redis.del(`refresh_token:${decoded.userID}`);
    }
    //*clearing cookies.
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("error in logout controller :-", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const refreshToken = async (req, res) => {
  try {
    //*getting refreshtoken from the cookies.
    const refreshToken = req.cookies.refreshToken;

    //*validation check
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }
    //*decoaded to get the payload data{userID}
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    
    //*get the token form redis `refresh_token:${decoded.userID}` CASESENSTIVE
    const storedToken = await redis.get(`refresh_token:${decoded.userID}`);

    //*compare if both the tokens are same or not if not return error
    if (storedToken !== refreshToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }
    
    //*again create accessToken using acess token function.
    const accessToken = jwt.sign(
      { userID: decoded.userID },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "15m",
      }
    );

    //*store that newAccessToken to the cookie 
    res.cookie("accessToken", accessToken, {
      httpOnly: true, //* prevent XSS attacks, cross site scripting attack.
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict", //* prevents CSRF attack, cross-site request forgery attack
      maxAge: 7 * 24 * 60 * 60 * 1000, //*7days
    });
    res.json({ message: "Token refreshed successfully" });

  } catch (error) {
    //*catchin any error
    console.log("Error in refreshToken controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

