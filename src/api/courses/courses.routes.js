const express = require("express");
const CoursesRoutes = express.Router();

const { getCourses, deleteCourses,createCourses } = require("./courses.controller");

CoursesRoutes.get("/getCourses", getCourses);
CoursesRoutes.post("/createCourse", createCourses);
CoursesRoutes.delete("/deleteCourse/:courseId", deleteCourses);



module.exports = CoursesRoutes;
