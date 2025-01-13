import { Injectable } from '@nestjs/common';
import type { TDocumentDefinitions } from 'pdfmake';

import PdfPrinter from 'pdfmake';

@Injectable()
export class PrinterService {
  private printer: PdfPrinter;

  constructor() {
    const fonts = {
      Arial: {
        normal: 'src/assets/fonts/arial.ttf',
        bold: 'src/assets/fonts/arial_narrow.ttf',
        italics: 'src/assets/fonts/arial_italic.ttf',
        bolditalics: 'src/assets/fonts/arial_narrow.ttf',
        600: 'src/assets/fonts/arial_narrow.ttf',
      },
    };
    this.printer = new PdfPrinter(fonts);
  }

  async createPdf(docDefinition: TDocumentDefinitions) {
    return this.printer.createPdfKitDocument(docDefinition);
  }
}
