export type CommandeCreate = {
  client_name: string;
  phone: string;
  address: string;
  commande: string;
  date?: string | null; // "YYYY-MM-DD" is fine
};

export interface CommandeOut {
  id: number;
  client_name: string;
  phone: string;
  address: string;
  commande: string;
  date: string;
}
