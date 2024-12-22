import mongoose, { model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Veuillez fournir un prénom"],
      maxLength: 50,
      minLength: 3,
    },
    lastName: {
      type: String,
      required: [true, "Veuillez fournir un nom"],
      maxLength: 50,
      minLength: 3,
    },
    email: {
      type: String,
      required: [true, "Veuillez fournir un email"],
      unique: true,
      lowercase: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Veuillez fournir un email valide",
      ],
    },
    password: {
      type: String,
      required: [true, "Veuillez fournir un mot de passe"],
      minLength: 6,
    },
    role: {
      type: String,
      required: [true, "Veuillez fournir un rôle"],
      enum: ["user", "admin"],
      default: "user",
      minLength: 3,
    },
    birthDate: {
      type: Date,
      required: [true, "Veuillez fournir une date de naissance"],
      validate: {
        validator: function (value) {
          // value correspond à la valeur acutelle saisie dans le chmap birthDate
          const minAge = 18;
          const birthDate = new Date(value);
          const age = new Date().getFullYear() - birthDate.getFullYear();
          return age >= minAge;
        },
        message: "L'âge minimum est de 18 ans.",
      },
    },
    address: {
      type: String,
      required: [true, "Veuillez fournir une adresse"],
    },
    postalCode: {
      type: String,
      maxLength: 5,
      required: [true, "Veuillez fournir un code postal"],
      match: [/^\d{5}$/, "Code postal invalide"],
    },
    city: {
      type: String,
      required: [true, "Veuillez fournir une ville"],
    },
    phoneNumber: {
      type: String,
      required: [true, "Veuillez fournir un numéro de téléphone"],
      match: [/^\+?\d{10,15}$/, "Numéro de téléphone invalide"],
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

// Middleware pour hacher le mot de passe avant de sauvegarder
UserSchema.pre("save", async function () {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }
});

// Méthodes pour l'utilisateur
UserSchema.methods.toJSON = function () {
  let userObject = this.toObject();
  delete userObject.password; // Ne pas retourner le mot de passe
  return userObject;
};

UserSchema.methods.createAccessToken = function () {
  return jwt.sign(
    { userID: this._id, role: this.role },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};

UserSchema.methods.comparePasswords = async function (userPassword) {
  const isMatch = await bcrypt.compare(userPassword, this.password);

  return isMatch;
};

UserSchema.methods.createResetToken = function () {
  const resetToken = jwt.sign({ userID: this._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  return resetToken;
};

export default model("User", UserSchema);
