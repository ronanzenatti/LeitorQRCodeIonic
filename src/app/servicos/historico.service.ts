import { Historico } from './../model/Historico';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class HistoricoService {

  constructor(private firestore: AngularFirestore) { }

  // Create
  create(historico: Historico) {
    return this.firestore.collection('historicos').add({ ...historico });
  }

  /* Get Single
  get(id: string) {
    this.historicoRef = this.db.object('/historico/' + id);
    return this.historicoRef;
  }*/

  // Get List
  getList() {
    return this.firestore.collection('historicos', ref => ref.orderBy('dataHora', 'desc')).snapshotChanges();
  }

  // Update
  update(id: string, historico: Historico) {
    return this.firestore.doc(`historicos/${id}`).update(historico);
  }

  // Delete
  delete(id: string) {
    return this.firestore.doc(`historicos/${id}`).delete();
  }
}
