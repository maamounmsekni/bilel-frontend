import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/enviroment';
import { CommandeCreate, CommandeOut } from '../models/commande.model';

@Injectable({ providedIn: 'root' })
export class GarageApiService {
  private base = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  createCommande(data: CommandeCreate) {
    return this.http.post<CommandeOut>(`${this.base}/commandes`, data);
  }

  listCommandes(limit = 50, phone?: string) {
    let params = new HttpParams().set('limit', limit);
    if (phone && phone.trim()) params = params.set('phone', phone.trim());
    return this.http.get<CommandeOut[]>(`${this.base}/commandes`, { params });
  }

  updateCommande(id: number, payload: Partial<CommandeCreate>) {
    return this.http.put<CommandeOut>(`${this.base}/commandes/${id}`, payload);
  }

  deleteCommande(id: number) {
    return this.http.delete(`${this.base}/commandes/${id}`);
  }
}
