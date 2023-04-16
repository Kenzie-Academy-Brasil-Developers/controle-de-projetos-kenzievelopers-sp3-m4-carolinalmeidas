import { Request, Response, response } from "express";
import { QueryConfig, QueryResult } from "pg";
import format from "pg-format";
import {
  TDeveloperInfos,
  TDeveloperInfosRequest,
  TDevelopers,
  TDevelopersRequest,
} from "../interfaces/developers";
import { client } from "../database";

const createDevelopers = async (
  req: Request,
  resp: Response
): Promise<Response> => {
  const developersData: TDevelopersRequest = req.body;
  const queryString: string = format(
    `
        INSERT INTO
            developers
            (%I)
        VALUES
            (%L)
        RETURNING *;
        `,
    Object.keys(developersData),
    Object.values(developersData)
  );

  const queryResult: QueryResult<TDevelopers> = await client.query(queryString);

  return resp.status(201).json(queryResult.rows[0]);
};

const listDevelopers = async (
  req: Request,
  resp: Response
): Promise<Response> => {
  const id: number = parseInt(req.params.id);

  const queryString: string = `
    SELECT
        devIn."developerId",
        dev."name" "developerName",
        dev."email" "developerEmail",
        devIn."developerSince" "developerInfoDeveloperSince",
        devIn."preferredOS" "developerInfoPreferredOS"
    FROM
        developers dev 
    FULL JOIN 
        developer_infos devIn ON dev."id" = devIn."developerId"
    WHERE
        dev."id" = $1;
    `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult<TDeveloperInfos> = await client.query(
    queryConfig
  );
  return resp.status(200).json(queryResult.rows[0]);
};

const updateDevelopers = async (
  req: Request,
  resp: Response
): Promise<Response> => {
  const developerData: TDevelopersRequest = req.body;
  const id: number = parseInt(req.params.id);

  const queryString: string = format(
    `
        UPDATE
            developers
            SET(%I) = ROW(%L)
        WHERE
            id = $1
        RETURNING *;
    `,
    Object.keys(developerData),
    Object.values(developerData)
  );

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult = await client.query(queryConfig);

  return resp.status(200).json(queryResult.rows[0]);
};

const deleteDevelopers = async (
  req: Request,
  resp: Response
): Promise<Response> => {
  const id: number = parseInt(req.params.id);

  const queryString: string = `
    DELETE FROM
      developers
    WHERE
        id = $1
    `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  await client.query(queryConfig);
  return resp.status(204).send();
};

const createInfosDevelopers = async (
  req: Request,
  resp: Response
): Promise<Response> => {
  const developersInfoData: TDeveloperInfosRequest = req.body;
  developersInfoData.developerId = parseInt(req.params.id);
  const queryString: string = format(
    `
        INSERT INTO
            developer_infos
            (%I)
        VALUES
            (%L)
        RETURNING *;

        `,
    Object.keys(developersInfoData),
    Object.values(developersInfoData)
  );
  const queryResult: QueryResult = await client.query(queryString);
  return resp.status(201).json(queryResult.rows[0]);
};

export {
  createDevelopers,
  listDevelopers,
  updateDevelopers,
  deleteDevelopers,
  createInfosDevelopers,
};
