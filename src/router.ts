import { Router } from "express";
import { body } from "express-validator";
import {
  createAccount,
  getUser,
  getUserByHandle,
  login,
  searchByHandle,
  updateProfile,
  uploadImage,
} from "./handlers";
import { handleInputErros } from "./middleware/validation";
import { authenticate } from "./middleware/auth";

const validateUser = [
  body("name").notEmpty().withMessage("Nombre es requerido"),
  body("handle").notEmpty().withMessage("Handle es requirido"),
  body("email").isEmail().withMessage("Email no es válido"),
  body("password")
    .isLength({ min: 8, max: 12 })
    .withMessage("Contraseña es muy corta, mínimo 8 caracteres"),
];

const validateLogin = [
  body("email").isEmail().withMessage("Email no es válido"),
  body("password").notEmpty().withMessage("La contraseña es requerida"),
];

const validateProfile = [
  body("handle").notEmpty().withMessage("Handle es requirido"),
  body("description").notEmpty().withMessage("description es requirido"),
];

const validateSearch = [
  body("handle").notEmpty().withMessage("Handle es requirido"),
];

const router = Router();

//?  Authentication and Register
router.post("/auth/register", validateUser, handleInputErros, createAccount);

router.post("/auth/login", validateLogin, handleInputErros, login);

router.get("/user", authenticate, getUser);
router.patch(
  "/user",
  validateProfile,
  handleInputErros,
  authenticate,
  updateProfile
);

router.post("/user/image", authenticate, uploadImage);

router.get("/:handle", getUserByHandle);

router.post("/search", validateSearch, searchByHandle);

export default router;
