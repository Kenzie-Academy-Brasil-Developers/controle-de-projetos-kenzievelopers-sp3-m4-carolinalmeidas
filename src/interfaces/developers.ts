type TDevelopers = {
  id: number;
  name: string;
  email: string;
};
type TDevelopersRequest = Omit<TDevelopers, "id">;

type TDeveloperInfos = {
  id: number;
  developerSince: Date | null;
  preferredOS: string | null;
  developerId?: number;
};
type TDeveloperInfosRequest = Omit<TDeveloperInfos, "id">;

export {
  TDevelopers,
  TDevelopersRequest,
  TDeveloperInfos,
  TDeveloperInfosRequest,
};
