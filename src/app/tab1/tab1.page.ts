import { Component } from '@angular/core';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { AlertController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  public scanner: any;

  public body: HTMLElement;
  public img: HTMLElement;

  constructor(private qrScanner: QRScanner, public alertController: AlertController, public platform: Platform) {
    this.platform.backButton.subscribeWithPriority(0, () => {

      this.body.style.opacity = "1";
      this.img.style.opacity = "1";

      this.qrScanner.hide(); // hide camera preview
      this.scanner.unsubscribe(); // stop scanning
    });
  }

  public lerQRCode() {

    this.body = document.getElementsByTagName("ion-content")[0] as HTMLElement;

    this.img = document.getElementById('logo') as HTMLElement;

    this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          // camera permission was granted
          this.body.style.opacity = "0";
          this.img.style.opacity = "0";
          // start scanning
          this.qrScanner.show();
          this.scanner = this.qrScanner.scan().subscribe((text: string) => {
            console.log('Scanned something', text);

            this.presentAlert(text);

            this.body.style.opacity = "1";
            this.img.style.opacity = "1";

            this.qrScanner.hide(); // hide camera preview
            this.scanner.unsubscribe(); // stop scanning
          });

        } else if (status.denied) {
          // camera permission was permanently denied
          // you must use QRScanner.openSettings() method to guide the user to the settings page
          // then they can grant the permission from there
        } else {
          // permission was denied, but not permanently. You can ask for permission again at a later time.
        }
      })
      .catch((e: any) => console.log('Error is', e));

  }

  async presentAlert(text) {
    const alert = await this.alertController.create({
      header: 'Leitor de QRCode',
      subHeader: 'Resultado:',
      message: text,
      buttons: ['OK']
    });

    await alert.present();
  }

}
