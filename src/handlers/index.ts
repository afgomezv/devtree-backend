import { Request, Response } from "express";
import { validationResult } from "express-validator";
import User from "../models/User";
import { checkPassword, hashPassword } from "../utils/auth";
import { generateUniqueSlug } from "../utils/slug";

export const createAccount = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    const error = new Error("Correo electrónico ya esta registrado");
    res.status(409).json({ error: error.message });
    return;
  }

  const handle = generateUniqueSlug(req.body.handle);
  const handleExists = await User.findOne({ handle });

  if (handleExists) {
    const error = new Error("Usuario no esta disponible");
    res.status(409).json({ error: error.message });
    return;
  }

  const user = new User(req.body);
  user.password = await hashPassword(password);
  user.handle = handle;

  await user.save();
  res.status(201).json({ message: "Usuario registrado correctamente" });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    const error = new Error("El usuario no existe");
    res.status(404).json({ error: error.message });
    return;
  }

  const isPasswordCorrect = await checkPassword(password, user.password);

  if (!isPasswordCorrect) {
    const error = new Error("Contraseña incorrecta");
    res.status(401).json({ error: error.message });
    return;
  }

  res.json({ message: "Autenticado...." });
};
