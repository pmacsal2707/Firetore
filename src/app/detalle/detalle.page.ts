import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Receta } from '../receta';
import { OverlayEventDetail } from '@ionic/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { ImagePicker } from '@awesome-cordova-plugins/image-picker/ngx';

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
  isNew: boolean = false;
  imagenSelec: string = "";

  constructor(
    private activatedRoute: ActivatedRoute,
    private firestoreService: FirestoreService,
    private router: Router,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private imagePicker: ImagePicker) { }

  ngOnInit() {
    let idRecibido = this.activatedRoute.snapshot.paramMap.get('id');
    if (idRecibido === 'nuevo') {
      this.isNew = true;
      this.document.data = {} as Receta;
    } else if (idRecibido != null) {
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

  public alertButtons = [
    {
      text: 'Cancel',
      role: 'cancel',
      handler: () => {
        this.router.navigate(['/home']);
      },
    },
    {
      text: 'OK',
      role: 'confirm',
      handler: () => {
        this.clicBotonBorrar();
      },
    },
  ];

  setResult(event: CustomEvent<OverlayEventDetail>) {
    console.log(`Dismissed with role: ${event.detail.role}`);
  }

  async seleccionarImagen() {
    // Comprobar si la aplicación tiene permisos de lectura
    this.imagePicker.hasReadPermission().then
      ((result) => {
        // Si no tiene permiso de lectura se solicita al usuario
        if (result == false) {
          this.imagePicker.requestReadPermission();
        }
        else {
          // Abrir selector de imágenes (ImagePicker)
          this.imagePicker.getPictures({
            maximumImagesCount: 1,  // Permitir sólo 1 imagen
            outputType: 1           // 1 = Base64
          }).then
            ((results) => { // En la variable results se tienen las imágenes seleccionadas
              if (results.length > 0) { // Si el usuario ha elegido alguna imagen
                // EN LA VARIABLE imagenSelec QUEDA ALMACENADA LA IMAGEN SELECCIONADA
                this.imagenSelec = "data:image/jpeg;base64," + results[0];
                console.log("Imagen que se ha seleccionado (en Base64): " + this.imagenSelec);
              }
            },
              (err) => {
                console.log(err);
              });
        }
      },
        (err) => {
          console.log(err);
        });
  }

  async subirImagen() {
    // Mensaje de espera mientras se sube la imagen
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });

    // Mensaje de finalización de subida de la imagen
    const toast = await this.toastController.create({
      message: 'Image was updated successfully',
      duration: 3000
    });

    // Carpeta del Storage donde se almacenará la imagen
    let nombreCarpeta = "imagenes";

    // Mostrar el mensaje de espera
    loading.present();

    // Asignar el nombre de la imagen en función de la hora actual para evitar duplicidades de nombres
    let nombreImagen = `${new Date().getTime()}`;

    // Llamar al método que sube la imagen al Storage
    this.firestoreService.subirImagenBase64(nombreCarpeta, nombreImagen, this.imagenSelec)
      .then(snapshot => {
        snapshot.ref.getDownloadURL()
          .then(downloadURL => {
            // EN LA VARIABLE downloadURL SE OBTIENE LA DIRECCIÓN URL DE LA IMAGEN
            console.log("downloadURL:" + downloadURL);
            //this.document.data.imagenURL = downloadURL;

            // Mostrar el mensaje de finalización de la subida
            toast.present();

            // Ocultar mensaje de espera
            loading.dismiss();
          });
      });
  }

  async eliminarArchivo(fileURL: string) {
    const toast = await this.toastController.create({
      message: 'File was deleted successfully',
      duration: 3000
    });

    this.firestoreService.eliminarArchivoPorUrl(fileURL)
      .then(() => {
        toast.present();
      }, (err) => {
        console.log(err);
      });
  }

}