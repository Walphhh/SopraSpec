export interface Project {
  id: number;
  ownerId: string;
  builder: string | null;
  architect: string | null;
  installer: string | null;
  consultant: string | null;
  preparedBy: string | null;
  location: string | null;
  date: string | null; // keep as ISO string for frontend
  notes: string | null;
  thumbnailUrl: string | null;
  createdAt: string;
}

export function toProjectModel(row: any): Project {
  return {
    id: row.id,
    ownerId: row.owner_id,
    builder: row.builder,
    architect: row.architect,
    installer: row.installer,
    consultant: row.consultant,
    preparedBy: row.prepared_by,
    location: row.location,
    date: row.date,
    notes: row.notes,
    thumbnailUrl: row.thumbnail_url,
    createdAt: row.created_at,
  };
}
