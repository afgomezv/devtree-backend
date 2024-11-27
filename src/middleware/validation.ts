import type { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

export const handleInputErros = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
};
