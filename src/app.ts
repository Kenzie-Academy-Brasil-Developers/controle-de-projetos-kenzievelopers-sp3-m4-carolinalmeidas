import express, { Application } from "express";
import "dotenv/config";
import {
  createDevelopers,
  createInfosDevelopers,
  deleteDevelopers,
  listDevelopers,
  updateDevelopers,
} from "./logics/developers";
import {
  createProjects,
  listProjects,
  updateProjects,
  deleteProjects,
  createTechnologies,
  deleteTechnologies,
} from "./logics/projects";
import { ensureEmailExist, ensureIdExist, ensureInfoExist, ensureOSExist } from "./middlewares/developers";
import { ensureIdExistProject,ensureIdExistProject2, ensureTecExist, ensureTecAdd, ensureTecAdd2, ensureTecExist2, ensureDeveloperIdExist} from "./middlewares/projects";

const app: Application = express();

app.use(express.json())

app.post("/developers", ensureEmailExist, createDevelopers);
app.get("/developers/:id", ensureIdExist, listDevelopers);
app.patch("/developers/:id", ensureIdExist, ensureEmailExist, updateDevelopers);
app.delete("/developers/:id", ensureIdExist, deleteDevelopers);
app.post("/developers/:id/infos", ensureIdExist, ensureInfoExist, ensureOSExist, createInfosDevelopers);

app.post("/projects", ensureIdExistProject, createProjects);
app.get("/projects/:id", ensureIdExistProject2, listProjects);
app.patch("/projects/:id", ensureIdExistProject2, ensureDeveloperIdExist, updateProjects);
app.delete("/projects/:id", ensureIdExistProject2, deleteProjects);
app.post("/projects/:id/technologies", ensureTecExist, ensureIdExistProject2, ensureTecAdd, createTechnologies);
app.delete("/projects/:id/technologies/:name", ensureIdExistProject2, ensureTecExist2, ensureTecAdd2, deleteTechnologies);

export default app;
