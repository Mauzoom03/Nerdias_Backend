
const express = require("express");
const UserRoutes = express.Router();
const { isAuth } = require("../../middlewares/auth.middleware");
const  upload  = require("../../middlewares/updateFile.middleware");
const  {
  register,
  login,
  logout,
  reqPassReset,
  resetPassword,
  isAdmin,
  patchUser,
  deleteUser,

} = require("./users.controllers");



UserRoutes.post("/register", register);
UserRoutes.post("/login", login);
// UserRoutes.get("/confirm-user/:token", confirm);
UserRoutes.post("/logout", [isAuth], logout);
UserRoutes.post("/requestPasswordReset", reqPassReset);
UserRoutes.patch("/resetPassword/:token", resetPassword);
UserRoutes.get("/is-admin", [isAuth], isAdmin);
UserRoutes.patch("/edit/:id", upload.single("image"), patchUser);
UserRoutes.delete("/user/:id", [isAuth], deleteUser);

module.exports = UserRoutes;
