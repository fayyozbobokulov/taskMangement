export interface Organization {
  id: number;
  name: string;
  created_by: number; // This represents the user who created the organization
  created_at?: Date; // Optional: Timestamp of when the organization was created
  updated_at?: Date; // Optional: Timestamp of when the organization was last updated
}
