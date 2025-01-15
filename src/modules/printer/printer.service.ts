import { Injectable } from '@nestjs/common';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
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
      },
    };
    this.printer = new PdfPrinter(fonts);
  }

  async createPdf(docDefinition: TDocumentDefinitions) {
    return this.printer.createPdfKitDocument(docDefinition);
  }
}
