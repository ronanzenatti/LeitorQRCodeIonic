import { HistoricoService } from './../servicos/historico.service';
import { Component, ChangeDetectorRef } from '@angular/core';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { AlertController, Platform } from '@ionic/angular';

import { Historico } from '../model/Historico';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  public scanner: any;

  public content: HTMLElement;
  public img: HTMLElement;
  public footer: HTMLElement;

  public resultado: string;
  public link = false;

  constructor(
    private qrScanner: QRScanner,
    private screenOrientation: ScreenOrientation,
    public alertController: AlertController,
    public platform: Platform,
    public historicoService: HistoricoService,
    private cdRef: ChangeDetectorRef
  ) {
    this.platform.backButton.subscribeWithPriority(0, () => {

      this.content.style.opacity = '1';
      this.img.style.opacity = '1';
      this.footer.style.opacity = '1';

      this.resultado = null;
      this.link = false;

      this.qrScanner.hide(); // hide camera preview
      this.scanner.unsubscribe(); // stop scanning
    });

    // set to portrait
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
  }

  public async lerQRCode() {

    this.content = document.getElementsByTagName('ion-content')[0] as HTMLElement;

    this.img = document.getElementById('logo') as HTMLElement;
    this.footer = document.getElementById('footer') as HTMLElement;

    this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          // camera permission was granted
          this.content.style.opacity = '0';
          this.img.style.opacity = '0';
          this.footer.style.opacity = '0';

          // start scanning
          this.qrScanner.show();
          this.scanner = this.qrScanner.scan().subscribe(async (text: string) => {
            console.log('Scanned something', text);

            this.resultado = (text['result']) ? text['result'] : text;

            this.content.style.opacity = '1';
            this.img.style.opacity = '1';
            this.footer.style.opacity = '1';

            this.qrScanner.hide(); // hide camera preview
            this.scanner.unsubscribe(); // stop scanning

            this.verificaLink(this.resultado);
            this.cdRef.detectChanges();

            // this.presentAlert('Resultado:', this.resultado);

            const historico = new Historico();

            historico.leitura = this.resultado;
            historico.dataHora = new Date();

            await this.historicoService.create(historico).then(resposta => {
              console.log(resposta);
            }).catch(error => {
              console.log('ERRO: ', error);
              this.presentAlert('ERRO!!!', 'Erro ao salvar no Firebase...');
            });
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

  async presentAlert(title, text) {
    const alert = await this.alertController.create({
      header: 'Leitor de QRCode',
      subHeader: title,
      message: text,
      buttons: ['OK']
    });

    await alert.present();
  }

  public verificaLink(texto: string) {
    const inicio = texto.substring(0, 4);
    console.log(inicio);
    if (inicio == 'www.' || inicio == 'http') {
      this.link = true;
    } else {
      this.link = false;
    }
  }

}
