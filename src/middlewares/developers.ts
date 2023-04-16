import { NextFunction, Request, Response } from "express";
import { QueryConfig, QueryResult } from "pg";
import { client } from "../database";

const ensureEmailExist = async (
  req: Request,
  resp: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { email } = req.body;

  const queryString: string = `
        SELECT 
            *
        FROM
            developers
        WHERE
            email = $1;
    `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [email],
  };
  const queryResult: QueryResult = await client.query(queryConfig);

  if (queryResult.rowCount !== 0) {
    return resp.status(409).json({
      message: "Email already exists.",
    });
  }
  return next();
};

const ensureIdExist = async (
  req: Request,
  resp: Response,
  next: NextFunction
): Promise<Response | void> => {
  const id: number = parseInt(req.params.id);

  const queryString: string = `
        SELECT 
            *
        FROM
            developers
        WHERE
            id = $1;
    `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };
  const queryResult: QueryResult = await client.query(queryConfig);

  if (queryResult.rowCount === 0) {
    return resp.status(404).json({
      message: "Developer not found.",
    });
  }
  return next();
};

const ensureInfoExist = async (
  req: Request,
  resp: Response,
  next: NextFunction
): Promise<Response | void> => {
  const id: number = parseInt(req.params.id);
  const queryString: string = `
        SELECT
            *
        FROM
           developer_infos
        WHERE
            developer_infos."developerId" = $1;
        `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };
  const queryResult: QueryResult = await client.query(queryConfig);
  if (queryResult.rowCount === 1) {
    return resp.status(409).json({
      message: "Developer infos already exists.",
    });
  }
  return next();
};

const ensureOSExist = async (
  req: Request,
  resp: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { preferredOS } = req.body;

  const queryString: string = `
  SELECT enumlabel FROM pg_enum WHERE enumtypid = 'OS'::regtype AND enumlabel = $1;
  `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [preferredOS],
  };
  const queryResult: QueryResult = await client.query(queryConfig);

  if (queryResult.rowCount === 0) {
    return resp.status(400).json({
      message: "Invalid OS option.",
      options: ["Windows", "Linux", "MacOS"],
    });
  }
  return next();
};

export { ensureEmailExist, ensureIdExist, ensureInfoExist, ensureOSExist };
