import { Router } from "express";
import { body } from "express-validator";
import { createAccount, login } from "./handlers";
import { handleInputErros } from "./middleware/validation";

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

const router = Router();

//?  Authentication and Register
router.post("/auth/register", validateUser, handleInputErros, createAccount);

router.post("/auth/login", validateLogin, handleInputErros, login);

export default router;
