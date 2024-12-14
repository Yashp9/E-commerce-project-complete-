import Coupon from "../model/coupon.model.js";

// Fetch active coupon for the user
export const getCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findOne({
      userID: req.user._id, // Fetch coupon for authenticated user
      isActive: true,      // Ensure the coupon is active
    });

    if (!coupon) {
      return res.status(404).json({ message: "No active coupon found" });
    }

    res.status(200).json(coupon); // Return active coupon
  } catch (error) {
    console.error("Error in getCoupon controller:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Validate a coupon provided by the user
export const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ message: "Coupon code is required" });
    }

    const coupon = await Coupon.findOne({
      code: code,          // Match the coupon code
      userID: req.user._id, // Ensure it's tied to the authenticated user
      isActive: true,      // Ensure it's active
    });

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    // Check if the coupon is expired
    if (coupon.expirationDate < Date.now()) {
      coupon.isActive = false; // Mark the coupon as inactive
      await coupon.save();     // Save changes to the database
      return res.status(400).json({ message: "Coupon expired" });
    }

    // Coupon is valid
    res.status(200).json({
      message: "Coupon is valid",
      code: coupon.code,
      discountPercentage: coupon.discountPercentage,
    });
  } catch (error) {
    console.error("Error in validateCoupon controller:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};




// export const getCoupon = async (req, res) => {
//   try {
//     const coupon = await Coupon.findOne({
//       userID: req.user._id,
//       isActive: true,
//     });
//     res.json(coupon || null);
//   } catch (error) {
//     console.log("Error in getCoupon controller", error.message);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// export const validateCoupon = async (req, res) => {
//   try {
//     const { code } = req.body;
//     const coupon = await Coupon.findOne({
//       code: code,
//       userID: req.user._id,
//       isActive: true,
//     });
//     if (!coupon) {
//       return res.status(404).json({ message: "coupon not found" });
//     }

//     if (coupon.expirationDate < new Date()) {
//       coupon.isActive = false;
//       await coupon.save();
//       return res.status(404).json({ message: "Coupon expired" });
//     }

//     res.json({
//       message: "Coupon is valid",
//       code: coupon.code,
//       discountPercentage: coupon.discountPercentage,
//     });
//   } catch (error) {
//     console.log("Error in validateCoupon controller", error.message);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// model {code,discout%,expirationDate,isActive,userID}
