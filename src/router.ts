import { Router } from "express";
import { body } from "express-validator";
import { createAccount } from "./handlers";

const validateUser = [
  body("name").notEmpty().withMessage("Nombre es requerido"),
  body("handle").notEmpty().withMessage("Handle es requirido"),
  body("email").isEmail().withMessage("Email no es válido"),
  body("password")
    .isLength({ min: 8, max: 12 })
    .withMessage("Contraseña es muy corta, mínimo 8 caracteres"),
];

const router = Router();

//?  Authentication and Register
router.post("/auth/register", validateUser, createAccount);

export default router;
