export interface Certificate {
  id: string;
  user_id: string;
  file_path: string;
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
  approved_at: string | null;
  rejected_at: string | null;
  approved_by: string | null;
  notes: string | null;
  profiles: {
    first_name: string | null;
    last_name: string | null;
    email: string | null;
  };
}
