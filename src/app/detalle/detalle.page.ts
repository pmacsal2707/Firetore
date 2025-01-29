import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Receta } from '../receta';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
  standalone: false
})
export class DetallePage implements OnInit {
  id: string = "";
  document: any = {
    id: "",
    data: {} as Receta
  };

  constructor(private activatedRoute: ActivatedRoute, private firestoreService: FirestoreService, private router: Router) { }

  ngOnInit() {
    let idRecibido = this.activatedRoute.snapshot.paramMap.get('id');
    if (idRecibido != null) {
      this.id = idRecibido;
      this.consultarPorId(this.id);
    } else {
      this.id = "No se ha recibido ningún id";
    }
  }

  consultarPorId(idConsultar: string) {
    this.firestoreService.consultarPorId("recetas", idConsultar).subscribe((resultado) => {
      if (resultado.payload.data() != null) {
        this.document.id = resultado.payload.id;
        this.document.data = resultado.payload.data();
      } else {
        this.document.data = {} as Receta;
      }
    });
  }

  clicBotonInsertar() {
    this.firestoreService.insertar("recetas", this.document.data).then(() => {
      console.log('Receta creada correctamente!');
      this.router.navigate(['/home']);
    }, (error) => {
      console.error(error);
    });
  }

  clicBotonBorrar() {
    this.firestoreService.borrar("recetas", this.id).then(() => {
      console.log('Receta borrada correctamente!');
      this.router.navigate(['/home']);
    }, (error) => {
      console.error(error);
    });
  }

  clicBotonModificar() {
    this.firestoreService.actualizar("recetas", this.id, this.document.data).then(() => {
      console.log('Receta modificada correctamente!');
      this.router.navigate(['/home']);
    }, (error) => {
      console.error(error);
    });
  }

  clicBotonVolver() {
    this.router.navigate(['/home']);
  }
}