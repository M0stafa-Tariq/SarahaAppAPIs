import User from "../../../DB/models/user.model.js";
import bcrypt from "bcryptjs";

//========================signup========================//
export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    //check username
    const isUserName = await User.findOne({ username });
    if (isUserName) {
      // return res.status(409).json({
      //   success: false,
      //   message: "Username is already exist",
      // });
      return next(new Error("Username is already exist",{cause:403})) //we can use "new Error" if we only create the global response
    }

    //check email
    const isEmail = await User.findOne({ email });
    if (isEmail) {
      // return res.status(409).json({
      //   success: false,
      //   message: "Email is already exist",
      // });
      return next(new Error("Email is already exist",{cause:409}))
    }
    //create user
    const hashedPassword = bcrypt.hashSync(password, +process.env.SALT_ROUND);
    const createdUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    if (!createdUser) {
      // return res.status(500).json({
      //   success: false,
      //   message: "User registration failed",
      // });
      return next(new Error("User registration failed",{cause:500}))
    }
    return res.status(201).json({
      success: true,
      message: "User registration success",
    });
};

//========================signin========================//
export const signin = async (req, res, next) => {
    const { username, email, password } = req.body;
    const isUserOrEmail = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (!isUserOrEmail) {
      // return res.status(400).json({
      //   success: false,
      //   message: "Invalid user credentials",
      // });
      return next(new Error("Invalid user credentials",{cause:400}))
    }

    const isPasswordMatch = bcrypt.compareSync(
      password,
      isUserOrEmail.password
    ); //boolean
    if (!isPasswordMatch) {
      // return res.status(400).json({
      //   success: false,
      //   message: "Invalid user credentials",
      // });
      return next(new Error("Invalid user credentials",{cause:400}))
    }

    return res.status(200).json({
      success: true,
      message: "You are logged in successfully!",
    });

};
//========================update user========================//
export const updateAccount = async (req, res, next) => {
    const { username, email } = req.body;
    const { _id, loggedInId } = req.query;

    //authorizataion check
    if (_id !== loggedInId) {
      // return res.status(401).json({
      //   message: "updated fail-unauthorized",
      // });
      return next(new Error("updated fail-unauthorized",{cause:401}))
    }

    let updateObject = {};

    if (username) {
      //check username
      const isUserName = await User.findOne({ username });
      if (isUserName) {
        // return res.status(403).json({
        //   success: false,
        //   message: "Username is already exist",
        // });
        return next(new Error("Username is already exist",{cause:403}))
      }
      updateObject.username = username;
    }
    if (email) {
      //check email
      const isEmail = await User.findOne({ email });
      if (isEmail) {
        // return res.status(403).json({
        //   success: false,
        //   message: "Email is already exist",
        // });
        return next(new Error("Email is already exist",{cause:403}))
      }
      updateObject.email = email;
    }
    //update
    const updatedUser = await User.updateOne({ _id }, { email, username });
    if (!updatedUser.modifiedCount) {
      // return res
      //   .status(400)
      //   .json({ success: false, message: "Invalid userId" });
        return next(new Error("Invalid userId",{cause:400}))
    }
    return res.status(200).json({ message: "User updated successfully!" });
};

//========================delete user========================//
export const deleteAccount = async (req, res, next) => {
    const { _id, loggedInId } = req.query;
    if (_id !== loggedInId) {
      // return res.status(401).json({
      //   message: "deleted fail-unauthorized",
      // });
      return next(new Error("deleted fail-unauthorized",{cause:401})) //we can use "new Error" if we only create global response
    }
    const user = await User.findByIdAndDelete(_id);
    if (!user) {
      // return res.status(400).json({
      //   message: "delete fail",
      // });
      return next(new Error("delete fail",{cause:400}))
    }
    return res.status(200).json({
      success: true,
      message: "deleted success!",
    });
};

//========================getUserData========================//
export const getUserData = async (req, res, next) => {
    const { _id } = req.params;
    const user = await User.findById(_id,"username -_id");
    if (!user) {
      // return res.status(400).json({
      //   message: "invalid userId",
      // });
      return next(new Error("Invalid userId",{cause:400}))
    }
    return res.status(200).json({
      message: "Done",
      user,
    });
};
