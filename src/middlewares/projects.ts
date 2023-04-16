import { NextFunction, Request, Response } from "express";
import { QueryConfig, QueryResult } from "pg";
import { client } from "../database";

const ensureIdExistProject = async (
  req: Request,
  resp: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { developerId } = req.body;

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
    values: [developerId],
  };
  const queryResult: QueryResult = await client.query(queryConfig);

  if (queryResult.rowCount === 0) {
    return resp.status(404).json({
      message: "Developer not found.",
    });
  } else {
    return next();
  }
};
const ensureIdExistProject2 = async (
  req: Request,
  resp: Response,
  next: NextFunction
): Promise<Response | void> => {
  const id: number = parseInt(req.params.id);

  const queryString: string = `
        SELECT 
            *
        FROM
          projects
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
      message: "Project not found.",
    });
  }
  return next();
};
const ensureTecExist = async (
  req: Request,
  resp: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { name } = req.body;

  const queryString: string = `
          SELECT 
              t."name"
          FROM 
              technologies t
          WHERE 
              t.name = $1;
    `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [name],
  };
  const queryResult: QueryResult = await client.query(queryConfig);
  if (queryResult.rowCount === 0) {
    return resp.status(400).json({
      message: "Project Technology not supported.",
      options: [
        "JavaScript",
        "Python",
        "React",
        "Express.js",
        "HTML",
        "CSS",
        "Django",
        "PostgreSQL",
        "MongoDB",
      ],
    });
  }
  return next();
};
const ensureTecAdd = async (
  req: Request,
  resp: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { name } = req.body;
  const { id } = req.params


  const queryString: string = `
        SELECT
            t."name" 
        FROM
            projects_technologies pt
        JOIN
            technologies t ON t.id = pt."technologyId" 
        WHERE 
            pt."projectId" = $1  AND t."name" = $2;
    `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id, name],
  };

  const queryResult: QueryResult = await client.query(queryConfig);

  if(queryResult.rowCount > 0) {
    return resp.status(409).json({
      message: "This technology is already associated with the project",
    });
  }else{
    return next();
  }

};
const ensureTecAdd2 = async (
  req: Request,
  resp: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { name } = req.params;
  const { id } = req.params

  const queryString: string = `
        SELECT
            t."name" 
        FROM
            projects_technologies pt
        JOIN
            technologies t ON t.id = pt."technologyId" 
        WHERE 
            pt."projectId" = $1 AND t."name" = $2;
    `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id, name]
  };
  const queryResult: QueryResult = await client.query(queryConfig);
 
  if (queryResult.rowCount === 0) {
    return resp.status(400).json({
      message: "Technology not related to the project.",
    });
  }
  return next();
};
const ensureTecExist2 = async (
  req: Request,
  resp: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { name } = req.params;

  const queryString: string = `
          SELECT 
              t."name"
          FROM 
              technologies t
          WHERE 
              t.name = $1;
    `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [name],
  };
  const queryResult: QueryResult = await client.query(queryConfig);
  if (queryResult.rowCount === 0) {
    return resp.status(400).json({
      message: "Project Technology not supported.",
      options: [
        "JavaScript",
        "Python",
        "React",
        "Express.js",
        "HTML",
        "CSS",
        "Django",
        "PostgreSQL",
        "MongoDB",
      ],
    });
  }
  return next();
};
const ensureDeveloperIdExist = async (
  req: Request,
  resp: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { developerId } = req.body;

  const queryString: string = `
        SELECT 	
          *
        FROM 
          developers
        WHERE 
          developers."id" = $1; 
    `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [developerId],
  };
  const queryResult: QueryResult = await client.query(queryConfig);

  if (queryResult.rowCount === 0) {
    return resp.status(404).json({
      message: "Developer not found.",
    });
  }
  return next();
};
export {
  ensureIdExistProject,
  ensureIdExistProject2,
  ensureTecExist,
  ensureTecAdd,
  ensureTecAdd2,
  ensureTecExist2,
  ensureDeveloperIdExist,
};
