import jwt from "jsonwebtoken";
import User from "../model/user.model.js";

//* Middleware to protect routes by ensuring the user is authenticated
export const protectRoute = async (req, res, next) => {
  try {
    //* Step 1: Get accessToken from cookies
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      // If no access token is provided, return a 401 Unauthorized response
      return res
        .status(401)
        .json({ message: "Unauthorized - No access token provided" });
    }

    try {
      //* Step 2: Verify the token and extract the payload (userID)
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

      //* Step 3: Fetch the user from the database, excluding the password field
      const user = await User.findById(decoded.userID).select("-password");

      if (!user) {
        // If the user is not found in the database, return a 401 Unauthorized response
        return res.status(401).json({ message: "User not found" });
      }

      //* Step 4: Attach the user object to the request object for the next middleware to use
      req.user = user;

      //* Step 5: Pass control to the next middleware or route handler
      next();
    } catch (error) {
      // Handle specific token errors, such as expiration
      if (error.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ message: "Unauthorized - Access token expired" });
      }
      // Throw any other token-related errors
      throw error;
    }
  } catch (error) {
    // Log any errors and return a generic 401 Unauthorized response
    console.log("Error in protectRoute middleware", error.message);
    return res
      .status(401)
      .json({ message: "Unauthorized - Invalid access token" });
  }
};

//* Middleware to restrict routes to admin users only
export const adminRoute = (req, res, next) => {
  //* Step 1: Check if the user exists and has an admin role
  if (req.user && req.user.role === "admin") {
    // If the user is an admin, pass control to the next middleware or route handler
    next();
  } else {
    //* Step 2: If the user is not an admin, return a 403 Forbidden response
    return res.status(403).json({ message: "Access denied - Admin only" });
  }
};
