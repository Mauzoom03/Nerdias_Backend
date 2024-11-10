
const { generateToken } = require("../../utils/jwt/jwt.js");
const { generateID } = require("../../utils/generateID/generateID.js");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../utils/configJwt.js");
const { transporter } = require("../../utils/nodemailer-config.js");
const User = require("./users.model.js");


const register = async (req, res, next) => {
  try {
    const regexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,12}$/;
    const { name, email, surname, password, username } = req.body;

    if (name === "" || surname === "" || username === "" || email === "") {
      return res.status(401).json({ msg: "¡No puedes dejar campos vacíos!" });
    }
    if (password.length < 8) {
      return res
        .status(401)
        .json({ msg: "¡La contraseña es demasiado corta!" });
    }
    if (!regexp.test(password)) {
      return res.status(401).json({
        msg: "¡La contraseña no cumple con los requisitos mínimos de seguridad! Recuerda que debe tener entre 8 y 12 caracteres y que debe incluir al menos: una letra mayúscula, una letra minúscula, un número y un carácter especial",
      });
    }

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(401).json({
        msg: "¡El correo ya existe, puedes solicitar crear una nueva contraseña si la has olvidado!",
      });
    }

    const user = new User({
      name,
      email,
      surname,
      password,
      username,
      token: generateID(),
    });

    await user.save();

    // Si el usuario se registra correctamente, envía una respuesta exitosa
    return res.status(200).json({ msg: "¡Registro exitoso!" });
  } catch (error) {
    // Si ocurre algún error, pasa el error al middleware de manejo de errores
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    // Buscar el usuario por el email
    const user = await User.findOne({ email: req.body.email });

    // Si no existe el usuario, se devuelve un error
    if (!user) {
      const error = new Error("El usuario no está registrado");
      return res.status(401).json({ msg: error.message });
    }

    // Comprobar si la contraseña es correcta
    const isPasswordCorrect = await user.passwordCheck(req.body.password);
    if (!isPasswordCorrect) {
      const error = new Error(
        "El correo electrónico o la contraseña no son correctos, revísalos e intenta nuevamente"
      );
      return res.status(401).json({ msg: error.message });
    }

    // Generar el token
    const token = generateToken(user._id, user.email);

    // Añadir el token al usuario (esto es opcional, ya que el token normalmente solo se envía al cliente)
    user.token = token;
    await user.save();

    // Responder con los detalles del usuario y el token
    return res.status(200).json({
      msg: "Login exitoso",
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        image: user.image,
        isAdmin: user.isAdmin,
        gender: user.gender,
        description: user.description,
        tags: user.tags,
      },
    });
  } catch (error) {
    console.error(error);
    next(error); // Pasar el error al middleware de manejo de errores
  }
};


const logout = async (req, res, next) => {
  try {
    const token = null;
    return res.status(201).json(token);
  } catch (error) {
    return next(error);
  }
};

const reqPassReset = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });

    // Generar token de restablecimiento
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h", // El token expira en 1 hora
    });

    // Guardar el token temporalmente en el usuario
    user.resetPasswordToken = resetToken;
    await user.save();

    // Enviar correo electrónico con el enlace de restablecimiento
    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    await transporter.sendMail({
      from: "maurowarzone2021@gmail.com",
      to: email,
      subject: "Restablecimiento de contraseña",
      html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p><a href="${resetLink}">${resetLink}</a>`,
    });

    res.json({ msg: "Correo de restablecimiento enviado" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ msg: "Error al enviar el correo de restablecimiento" });
  }
};

 const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.resetPasswordToken !== token) {
      return res.status(400).json({ msg: "Token inválido o expirado" });
    }

    // Actualizar la contraseña
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = null; // Limpiar el token de restablecimiento
    await user.save();

    res.json({ msg: "Contraseña restablecida exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ msg: "Token inválido o expirado" });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const parsedToken = token.replace("Bearer ", "");
    const user = JwtUtils.verifyToken(parsedToken, process.env.JWT_SECRET);
    const userLogued = await User.findById(user.id);
    return res.status(201).json(userLogued.isAdmin);
  } catch (error) {
    return next(error);
  }
};



const patchUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { username, name, surname, gender, description, tags } = req.body;
    let image = req.file ? req.file.path : null;
    const userToUpdate = {
      username,
      name,
      surname,
      gender,
      description,
      tags,
    }
    if (image) {
      userToUpdate.image = image;
    }
    const updatedUser = await User.findByIdAndUpdate(id, userToUpdate, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id; // Obtener el ID del usuario de los parámetros de la solicitud
    const deletedUser = await User.findByIdAndDelete(userId); // Buscar y eliminar el usuario por su ID
    if (!deletedUser) {
      // Si no se encuentra el usuario, devolver un mensaje de error
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully", deletedUser });
  } catch (error) {
    // Manejar errores
    res.status(500).json({ message: error.message });
  }
};



module.exports = {
  register,
  login,
  logout,
  reqPassReset,
  resetPassword,
  isAdmin,
  patchUser,
  deleteUser,
};
