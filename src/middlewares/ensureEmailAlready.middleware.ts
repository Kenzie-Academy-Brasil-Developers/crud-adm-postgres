import { NextFunction, Request, Response } from "express";
import format from "pg-format";
import { client } from "../database";
import { AppError } from "../errors";
import "express-async-errors";

const ensureEmailAlreadyMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const email: string = req.body.email;

  const emailExistsQuery = format(
    `SELECT EXISTS (SELECT 1 FROM users WHERE email = %L)`,
    email
  );
  const emailExistsResult = await client.query(emailExistsQuery);
  const emailExists = emailExistsResult.rows[0].exists;

  if (emailExists) {
    throw new AppError("E-mail already registered", 409);
  }
  return next();
};

export default ensureEmailAlreadyMiddleware;
