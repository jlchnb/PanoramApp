import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  async scanQRCode() {
    try {
      const result = await BarcodeScanner.startScan();
      console.log(result);
      if (result.hasContent) {
        alert(`QR Escaneado: ${result.content}`);
      } else {
        alert('No se detectó contenido en el QR');
      }
    } catch (error) {
      console.error('Error al escanear el código QR', error);
      alert('Error al escanear el código QR');
    }
  }
}
