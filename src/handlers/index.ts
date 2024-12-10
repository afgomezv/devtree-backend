import { Request, Response } from "express";
import formidable from "formidable";
import { v4 as uuid } from "uuid";
import User from "../models/User";
import { checkPassword, hashPassword } from "../utils/auth";
import { generateUniqueSlug } from "../utils/slug";
import { generateJWT } from "../utils/jwt";
import cloudinary from "../config/cloudinary";

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

  const token = generateJWT({ id: user.id });

  res.json({ message: token });
};

export const getUser = async (req: Request, res: Response) => {
  res.json(req.user);
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { description, links } = req.body;

    const handle = generateUniqueSlug(req.body.handle);
    const handleExists = await User.findOne({ handle });

    if (handleExists && handleExists.email !== req.user.email) {
      const error = new Error("Usuario no esta disponible");
      res.status(409).json({ error: error.message });
      return;
    }

    req.user.description = description;
    req.user.handle = handle;
    req.user.links = links;
    await req.user.save();

    res.send("perfil actualizado correctamente");
  } catch (e) {
    const error = new Error("Hubo un error");
    res.status(500).json({ error: error.message });
    return;
  }
};

export const uploadImage = async (req: Request, res: Response) => {
  const form = formidable({ multiples: false });

  try {
    form.parse(req, (error, fields, files) => {
      cloudinary.uploader.upload(
        files.file[0].filepath,
        {
          public_id: uuid(),
        },
        async function (error, result) {
          if (error) {
            res.status(500).json({ error: "Error al subir la imagen" });
            return;
          }
          if (result) {
            req.user.image = result.secure_url;
            await req.user.save();
            res.json({ image: result.secure_url });
          }
        }
      );
    });
  } catch (e) {
    const error = new Error("Hubo un error");
    res.status(500).json({ error: error.message });
  }
};
