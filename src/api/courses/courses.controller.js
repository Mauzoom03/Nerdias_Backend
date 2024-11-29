const Courses = require("./Courses.model");

const getCourses = async (req, res, next) => {
  try {
    const courses = await Courses.find();
    res.status(200).json(courses);
  } catch (error) {
    return next(error);
  }
};

const deleteCourses = async (req, res, next) => {
  const courseId = req.params.courseId; // Asegúrate de que este nombre coincida con el enrutador
  try {
    const course = await Courses.findByIdAndDelete(courseId); // Cambia 'courses' a 'Courses'

    if (!course) {
      return res.status(404).json({ message: "Curso no encontrado." });
    }

    res
      .status(200)
      .json({ message: "Curso eliminado correctamente", data: courseId });
  } catch (error) {
    return next(error);
  }
};

const createCourses = async (req, res, next) => {
  const { name, description, link, image, academy } = req.body; 

  try {
    const course = await Courses.create({
      name,
      description,
      link,
      image,
      academy,
    });
    res.status(201).json(course);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getCourses,
  deleteCourses,
  createCourses,
};
