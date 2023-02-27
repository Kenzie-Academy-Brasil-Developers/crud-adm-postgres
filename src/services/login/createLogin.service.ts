import { QueryConfig } from "pg";
import { IJwtPayload, ILoginRequest } from "../../interfaces/login.interface";
import { IUserResultWithPassword } from "../../interfaces/users.interfaces";
import { client } from "../../database";
import { AppError } from "../../errors";
import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";
import "express-async-errors";

const createLoginService = async (
  loginData: ILoginRequest
): Promise<string> => {
  
  const queryString: string = `
SELECT
    *
FROM
    users
WHERE
    email = $1;
`;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [loginData.email],
  };

  const queryResult: IUserResultWithPassword = await client.query(queryConfig);

  if (queryResult.rowCount === 0) {
    throw new AppError("Wrong email or password", 401);
  }

  const matchPassword: boolean = await compare(
    loginData.password,
    queryResult.rows[0].password
  );

  if (!matchPassword) {
    throw new AppError("Wrong email or password", 401);
  }

  const token: string = jwt.sign(
    {
      admin: queryResult.rows[0].admin,
      isActive: queryResult.rows[0].active,
      mail: queryResult.rows[0].email,
    },
    "secret",
    {
      expiresIn: "24h",
      subject: queryResult.rows[0].id.toString(),
    }
  );

  return token;
};

export default createLoginService;
