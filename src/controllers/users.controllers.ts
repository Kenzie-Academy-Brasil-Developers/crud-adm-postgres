import { Request, Response } from "express";
import createUsersService from "../services/users/createUsers.service";
import listUserService from "../services/users/listUser.service";
import { IUser } from "../interfaces/users.interfaces";

const createUsersController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const userData: IUser = req.body;
  const newUser = await createUsersService(userData);

  createUsersService(userData);

  return res.status(201).json(newUser);
};

const listUserController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const userId: number = parseInt(req.params.id);
  
  const user = await listUserService(userId);

  return res.json(user);
};

export { createUsersController, listUserController };