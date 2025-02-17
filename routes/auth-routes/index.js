const express = require("express");
const {
  registerUser,
  loginUser,
} = require("../../controllers/auth-controller/index");
// const authenticateMiddleware = require("../../middleware/auth-middleware");
const {authenticate,authorizeRole} = require("../../middleware/auth-middleware")
const router = express.Router();
// const { authorizeRole } = require("../../middleware/auth-middleware");
//console.log("EROOOOOOOOOOOOORRRRRRRRRR",require.resolve("../../middleware/auth-middleware"));


router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/check-auth", authenticate, (req, res) => {
  const user = req.user;

  res.status(200).json({
    success: true,
    message: "Authenticated user!",
    data: {
      user,
    },
  });
});

router.get("/instructor", authenticate, authorizeRole("instructor"), (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the instructor dashboard!",
  });
});

// Example of role-based access control for students
// Only accessible to users with the role "student"
router.get("/student", authenticate, authorizeRole("student"), (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the student dashboard!",
  });
});

module.exports = router;
