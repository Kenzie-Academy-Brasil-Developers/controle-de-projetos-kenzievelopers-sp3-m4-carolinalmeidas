import { Request, Response } from "express";
import { TProjectsRequest, TProjectsTechnologiesRequest } from "../interfaces/projects";
import format from "pg-format";
import { client } from "../database";
import { QueryConfig, QueryResult } from "pg";

const createProjects = async (
  req: Request,
  resp: Response
): Promise<Response> => {
  const projectData: TProjectsRequest = req.body;
  const queryString: string = format(
    `
          INSERT INTO
              projects
              (%I)
          VALUES
              (%L)
          RETURNING *;
          `,
    Object.keys(projectData),
    Object.values(projectData)
  );

  const queryResult: QueryResult = await client.query(queryString);

  return resp.status(201).json(queryResult.rows[0]);
};

const listProjects = async (
  req: Request,
  resp: Response
): Promise<Response> => {
  const id: number = parseInt(req.params.id);

  const queryString: string = `
  SELECT
      p."id" "projectId",
      p."name" "projectName",
      p."description" "projectDescription",
      p."estimatedTime" "projectEstimatedTime",
      p."repository" "projectRepository",
      p."startDate" "projectStartDate",
      p."endDate" "projectEndDate",
      p."developerId" "projectDeveloperId",
      t."id" "technologyId",
      t."name" "technologyName"
  FROM
      projects_technologies pt
  FULL JOIN
      projects p ON pt."projectId" = p."id"
  FULL JOIN
      technologies t ON t."id" = pt."projectId"
  WHERE
      p."id" = $1;
  `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult = await client.query(queryConfig);
  console.log(queryResult.rows)
  return resp.status(200).json(queryResult.rows);
};

const updateProjects = async (
  req: Request,
  resp: Response
): Promise<Response> => {
  const {id} = req.params
  const projectData = req.body
  const queryString: string = format(
    `
        UPDATE 
            projects
            SET(%I) = ROW(%L)
        WHERE
            id = $1
        RETURNING *;
    `,
    Object.keys(projectData),
    Object.values(projectData)
)
    const queryConfig: QueryConfig = {
      text: queryString,
      values: [id]
    }

    const queryResult: QueryResult = await client.query(queryConfig)
    return resp.json(queryResult.rows[0])
};

const deleteProjects = async (
  req: Request,
  resp: Response
): Promise<Response> => {
  const {id} = req.params

    const queryString: string = `
        DELETE FROM
          projects
        WHERE
          projects.id = $1;
    `

    const queryConfig: QueryConfig = {
      text: queryString,
      values: [id]
    }

    await client.query(queryConfig)
    return resp.status(204).send()
};

const createTechnologies = async (
  req: Request,
  resp: Response
): Promise<Response> => {

  const {name} = req.body
  const id: number = parseInt(req.params.id)


  const queryString: string = `
          SELECT 
            technologies."id"
        FROM 
            technologies
        WHERE 
          technologies."name" = $1;
  `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [name],
  }
  const queryResult: QueryResult = await client.query(queryConfig);

  const id2: number = queryResult.rows[0].id
 

  const tecData: TProjectsTechnologiesRequest = {
    addedIn: new Date(),
    technologyId: id2,
    projectId: id
  }
  const queryString2: string = format(
    `
          INSERT INTO
          projects_technologies
              (%I)
          VALUES
              (%L)
          RETURNING *;
          `,
    Object.keys(tecData),
    Object.values(tecData)
  );

  const queryResult2: QueryResult = await client.query(queryString2)
 

  const queryString3: string = `
        SELECT 
            t."id" "technologyId",
            t."name" "technologyName",
            pt."projectId",
            p."name" "projectName",
            p."description" "projectDescription",
            p."estimatedTime" "projectEstimatedTime",
            p."repository" "projectRepository",
            p."startDate" "projectStartDate",
            p."endDate" "projectEndDate"
      FROM 
            projects_technologies pt
      JOIN
            projects p ON p.id = pt."projectId"
      JOIN 
            technologies t ON t.id = pt."technologyId"
      WHERE 
            pt."technologyId" = $1 AND p."id" = $2;
  `
  const queryConfig2: QueryConfig = {
    text: queryString3,
    values: [id2, id]
  }
  const queryResult3: QueryResult = await client.query(queryConfig2);

  return resp.status(201).json(queryResult3.rows[0]);
  
};
const deleteTechnologies = async (
  req: Request,
  resp: Response
): Promise<Response> => {

  const id: number = parseInt(req.params.id)
  const name: string = req.params.name

  
  const queryString: string = `
    SELECT 
      t.id
    FROM 
      projects_technologies pt
      JOIN technologies t ON t.id = pt."technologyId" 
    WHERE 
      pt."projectId" = $1 AND t."name" = $2;
  `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id, name]
  }

  const queryResult: QueryResult= await client.query(queryConfig);

  const technologyId = queryResult.rows[0].id;

  const queryString2: string = `
    DELETE FROM 
      projects_technologies 
    WHERE 
      "projectId" = $1 AND "technologyId" = $2;
  `;

  const queryConfig2: QueryConfig = {
    text: queryString2,
    values: [id, technologyId]
  }

  await client.query(queryConfig2);

  return resp.status(204).send();

};

export {
  createProjects,
  listProjects,
  updateProjects,
  deleteProjects,
  createTechnologies,
  deleteTechnologies,
};

