import { HistoricoService } from './../servicos/historico.service';
import { Component } from '@angular/core';
import { Historico } from '../model/Historico';

import localePtBr from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  public historicos: Historico[] = [];

  constructor(private historicoService: HistoricoService) {
    registerLocaleData(localePtBr);
  }

  async ionViewWillEnter() {
    await this.buscarHistoricos();
  }

  public buscarHistoricos() {
    this.historicos = [];

    this.historicoService.getListPorData().subscribe(dados => {
      this.historicos = dados.map(registro => {
        return {
          $key: registro.payload.doc.id,
          leitura: registro.payload.doc.data()['leitura'],
          dataHora: new Date(registro.payload.doc.data()['dataHora']['seconds'] * 1000)
        } as Historico;
      });
    });
  }

  public deleteHistorico(id: string) {
    this.historicoService.delete(id);
  }

}
