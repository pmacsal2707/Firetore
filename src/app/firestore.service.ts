import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private angularFirestore: AngularFirestore,
    private angularFireStorage: AngularFireStorage) {
  }

  public insertar(coleccion: any, datos: any) {
    return this.angularFirestore.collection(coleccion).add(datos);
  }

  public consultar(coleccion: any) {
    return this.angularFirestore.collection(coleccion).snapshotChanges();
  }

  public borrar(coleccion: any, documentId: any) {
    return this.angularFirestore.collection(coleccion).doc(documentId).delete();
  }

  public actualizar(coleccion: any, documentId: any, datos: any) {
    return this.angularFirestore.collection(coleccion).doc(documentId).set(datos);
  }

  public consultarPorId(coleccion:any, documentId:any) {
    return this.angularFirestore.collection(coleccion).doc(documentId).snapshotChanges();
  }

  public subirImagenBase64(nombreCarpeta:string, nombreArchivo:string, imagenBase64:string) {
    let storageRef = this.angularFireStorage.ref(nombreCarpeta).child(nombreArchivo);
    return storageRef.putString(imagenBase64, 'data_url');
  }

  public eliminarArchivoPorUrl(url:string) {
    return this.angularFireStorage.storage.refFromURL(url).delete();
  }
}