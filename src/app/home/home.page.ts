import { Component } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { Receta } from '../receta';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false
})
export class HomePage {

  recetaEditando: Receta;
  idRecetaSelec: string = '';
  arrayColeccionRecetas: any = [{
    id: "",
    data: {} as Receta
  }];

  constructor(private firestoreService: FirestoreService, private router: Router) {
    // Crear una receta vacía
    this.recetaEditando = {} as Receta;
    this.obtenerListaRecetas();
  }

  obtenerListaRecetas() {
    this.firestoreService.consultar("recetas").subscribe((resultadoConsultaRecetas) => {
      this.arrayColeccionRecetas = [];
      resultadoConsultaRecetas.forEach((datosReceta: any) => {
        this.arrayColeccionRecetas.push({
          id: datosReceta.payload.doc.id,
          data: datosReceta.payload.doc.data()
        });
      });
    });
  }

  clicBotonInsertar() {
    this.router.navigate(['/detalle', 'nuevo']);
  }

  selecReceta(recetaSelec: any) {
    console.log("Receta seleccionada: ");
    console.log(recetaSelec);
    this.idRecetaSelec = recetaSelec.id;
    this.recetaEditando.nombre = recetaSelec.data.nombre;
    this.recetaEditando.ingredientes = recetaSelec.data.ingredientes;
    this.recetaEditando.instrucciones = recetaSelec.data.instrucciones;
    this.recetaEditando.tiempoPreparacion = recetaSelec.data.tiempoPreparacion;
    this.recetaEditando.dificultad = recetaSelec.data.dificultad;
    this.recetaEditando.porciones = recetaSelec.data.porciones;
    this.recetaEditando.categoria = recetaSelec.data.categoria;
    this.router.navigate(['/detalle', this.idRecetaSelec]);
  }

  clicBotonBorrar() {
    this.firestoreService.borrar("recetas", this.idRecetaSelec).then(() => {
      // Actualizar la lista completa
      this.obtenerListaRecetas();
      // Limpiar datos de pantalla
      this.recetaEditando = {} as Receta;
    })
  }

  clicBotonModificar() {
    this.firestoreService.actualizar("recetas", this.idRecetaSelec, this.recetaEditando).then(() => {
      // Actualizar la lista completa
      this.obtenerListaRecetas();
      // Limpiar datos de pantalla
      this.recetaEditando = {} as Receta;
    })
  }


}