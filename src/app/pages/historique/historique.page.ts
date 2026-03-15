import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { GarageApiService } from '../../core/api/garage-api.service';
import { CommandeCreate, CommandeOut } from '../../core/models/commande.model';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './historique.page.html',
  styleUrl: './historique.page.css',
})
export class HistoriquePage implements OnInit {
  phoneSearch = '';
  loading = false;
  error = '';

  rows: CommandeOut[] = [];

  showForm = false;
  editingId: number | null = null;

  form: CommandeCreate = {
    client_name: '',
    phone: '',
    address: '',
    commande: '',
    date: null,
  };

  constructor(private api: GarageApiService) {}

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll() {
    this.error = '';
    this.loading = true;

    this.api.listCommandes(200).subscribe({
      next: (res) => {
        this.rows = res || [];
        this.loading = false;
      },
      error: (e) => {
        this.rows = [];
        this.loading = false;
        this.error = e?.error?.detail || 'Erreur chargement';
      },
    });
  }

  search() {
    this.error = '';
    const phone = this.phoneSearch.trim();
    this.loading = true;

    this.api.listCommandes(200, phone || undefined).subscribe({
      next: (res) => {
        this.rows = res || [];
        this.loading = false;
      },
      error: (e) => {
        this.rows = [];
        this.loading = false;
        this.error = e?.error?.detail || 'Erreur recherche';
      },
    });
  }

  toggleForm() {
    this.showForm = !this.showForm;
    if (!this.showForm) this.resetForm();
  }

  startEdit(r: CommandeOut) {
    this.showForm = true;
    this.editingId = r.id;

    this.form = {
      client_name: r.client_name,
      phone: r.phone,
      address: r.address,
      commande: r.commande,
      date: r.date?.slice(0, 10) || null,
    };

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  addForSameClient(r: CommandeOut) {
    this.showForm = true;
    this.editingId = null; // create mode

    this.form = {
      client_name: r.client_name,
      phone: r.phone,
      address: r.address,
      commande: '',
      date: null,
    };

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancel() {
    this.resetForm();
    this.showForm = false;
  }

  private resetForm() {
    this.editingId = null;
    this.form = {
      client_name: '',
      phone: '',
      address: '',
      commande: '',
      date: null,
    };
  }

  submit() {
    this.error = '';

    const payload: CommandeCreate = {
      client_name: (this.form.client_name || '').trim(),
      phone: (this.form.phone || '').trim(),
      address: (this.form.address || '').trim(),
      commande: (this.form.commande || '').trim(),
      date: this.form.date || null,
    };

    if (!payload.client_name || !payload.phone || !payload.address || !payload.commande) {
      this.error = 'Veuillez remplir tous les champs.';
      return;
    }

    this.loading = true;

    if (this.editingId) {
      this.api.updateCommande(this.editingId, payload).subscribe({
        next: () => {
          this.loading = false;
          this.cancel();
          this.search(); // no forced phone
        },
        error: (e) => {
          this.loading = false;
          this.error = e?.error?.detail || 'Erreur modification';
        },
      });
      return;
    }

    this.api.createCommande(payload).subscribe({
      next: () => {
        this.loading = false;
        this.cancel();
        this.search(); // refresh list
      },
      error: (e) => {
        this.loading = false;
        this.error = e?.error?.detail || 'Erreur ajout';
      },
    });
  }

  deleteRow(r: CommandeOut) {
    if (!confirm(`Supprimer la commande #${r.id} ?`)) return;

    this.error = '';
    this.loading = true;

    this.api.deleteCommande(r.id).subscribe({
      next: () => {
        this.loading = false;
        this.search();
      },
      error: (e) => {
        this.loading = false;
        this.error = e?.error?.detail || 'Erreur suppression';
      },
    });
  }
}
