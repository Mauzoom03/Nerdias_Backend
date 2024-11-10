const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: false },
    surname: { type: String, trim: true, required: false },
    username: { type: String, trim: true, required: true, unique: true },
    token: { type: String, trim: false, required: true, unique: true },
    resetPasswordToken: { type: String, trim: false, required: false,default: null },
    email: { type: String, trim: true, required: true, unique: true },
    password: { type: String, trim: true, required: true },
    confirmed: { type: Boolean, trim: false, required: false, default: false },
    isAdmin: { type: Boolean, trim: false, required: false, default: false },
    image: {
      type: String,
      trim: false,
      required: false,
    },
    description: { type: String, trim: true, required: false },
    gender : { type: String, trim: true, required: false },
    tags: [{ type: String, trim: true, required: false }],
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "products" }],
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  { timestamps: true }
); 

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.passwordCheck = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("users", userSchema);
module.exports = User;
