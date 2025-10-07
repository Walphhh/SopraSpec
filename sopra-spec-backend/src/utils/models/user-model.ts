export interface User {
  id: string;
  firstName: string;
  lastName: string;
  createdAt: string;
}

export function toUserModel(row: any): User {
  return {
    id: row.user_id,
    firstName: row.first_name,
    lastName: row.last_name,
    createdAt: row.created_at,
  };
}
