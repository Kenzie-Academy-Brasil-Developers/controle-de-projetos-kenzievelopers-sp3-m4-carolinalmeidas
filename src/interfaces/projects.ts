type TProjects = {
  id: number;
  name: string;
  description: string;
  estimatedTime: string;
  repository: string;
  startDate: Date;
  endDate: Date | null;
  developerId: number;
};

type TProjectsRequest = Omit<TProjects, "id" | "developerId">;


type TProjectsTechnologies = {
  id: number;
  addedIn: Date;
  technologyId: number;
  projectId: number;
};
type TProjectsTechnologiesRequest = Omit<
  TProjectsTechnologies,
  "id">;

export {
  TProjects,
  TProjectsRequest,
  TProjectsTechnologies,
  TProjectsTechnologiesRequest,
};
