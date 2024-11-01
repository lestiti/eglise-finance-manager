export interface User {
  id: string;
  nom: string | null;
  prenom: string | null;
  role: string | null;
  telephone: string | null;
  email: string | null;
  created_at: string;
  last_sign_in?: string;
  total_transactions?: number;
  total_activities?: number;
}

export interface Activity {
  id: string;
  action: string;
  details: any;
  created_at: string;
}