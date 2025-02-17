const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const StudentCourses = require("../../models/StudentCourses")


const registerUser = async (req, res) => {
  // console.log("check point 1");
  const { userName, userEmail, password, role } = req.body;

  const existingUser = await User.findOne({
    $or: [{ userEmail }, { userName }],//The $or operator performs a logical OR operation on an array of one or more <expressions> and selects the documents that satisfy at least one of the <expressions>.
  });

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "User name or user email already exists",
    });
  }

  const hashPassword = await bcrypt.hash(password, 10);
  // console.log("check point 2");
  const newUser = new User({
    userName,
    userEmail,
    role,
    password: hashPassword,
  });
// console.log("check point 3");
  await newUser.save();
// console.log("check point 4");
  const newUserId = await User.findOne({
    userName
  }).select("_id");

  const studentCourses = new StudentCourses({
    userId: newUserId._id,
    courses:[]
  })

  await studentCourses.save();
// console.log("check point 5");
  return res.status(201).json({
    success: true,
    message: "User registered successfully!",
  });
};

const loginUser = async (req, res) => {
  const { userEmail, password } = req.body;

  const checkUser = await User.findOne({ userEmail });

  if (!checkUser || !(await bcrypt.compare(password, checkUser.password))) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  }

  const accessToken = jwt.sign(
    {
      _id: checkUser._id,
      userName: checkUser.userName,
      userEmail: checkUser.userEmail,
      role: checkUser.role,
    },
    "JWT_SECRET",
    { expiresIn: "120m" }
  );

  res.status(200).json({
    success: true,
    message: "Logged in successfully",
    data: {
      accessToken,
      user: {
        _id: checkUser._id,
        userName: checkUser.userName,
        userEmail: checkUser.userEmail,
        role: checkUser.role,
      },
    },
  });
};

module.exports = { registerUser, loginUser };
