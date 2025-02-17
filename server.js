require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth-routes/index");
const mediaRoutes = require("./routes/instructor-routes/media-routes");
const instructorCourseRoutes = require("./routes/instructor-routes/course-routes");
const studentViewCourseRoutes = require("./routes/student-routes/course-routes");
const studentViewOrderRoutes = require("./routes/student-routes/order-routes");
const studentCoursesRoutes = require("./routes/student-routes/student-courses-routes");
const studentCourseProgressRoutes = require("./routes/student-routes/course-progress-routes");
const { authenticate, authorizeRole } = require("./middleware/auth-middleware"); // Import auth middleware

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

app.use(
  cors({
    // origin: process.env.CLIENT_URL,
    origin:'http://localhost:5173',
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

//database connection
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("mongodb is connected"))
  .catch((e) => console.log(e));

//routes configuration
app.use("/auth", authRoutes);
app.use("/media", authorizeRole("instructor"), mediaRoutes);
app.use("/instructor/course",authorizeRole("instructor"), instructorCourseRoutes);
app.use("/student/course", authorizeRole("student"),studentViewCourseRoutes);
app.use("/student/order", authorizeRole("student"),studentViewOrderRoutes);
app.use("/student/courses-bought",authorizeRole("student"), studentCoursesRoutes);
app.use("/student/course-progress", authorizeRole("student"),studentCourseProgressRoutes);

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
});

app.listen(PORT, () => {
  console.log(`Server is now running on port ${PORT}`);
});
