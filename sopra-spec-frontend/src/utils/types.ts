export interface User {
  id: string;
  firstName: string;
  lastName: string;
  createdAt: string;
}

export interface SessionPayload {
  token: string;
  refresh_token: string;
  user_information: User;
  user?: any; // any because Ralph got lazy to type the Supabase user properties
}

export type Project = {
  id: string;
  name: string;
  location?: string;
  architect?: string;
  builder?: string;
};
