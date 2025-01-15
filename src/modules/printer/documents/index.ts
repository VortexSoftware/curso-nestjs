import type { StyleDictionary, TDocumentDefinitions } from 'pdfmake/interfaces';
const styles: StyleDictionary = {
  header: {
    fontSize: 16,
    bold: true,
    color: '#525659',
  },
  subheader: {
    fontSize: 10,
    bold: true,
    color: '#525659',
  },
};

export const generatePDF = async (): Promise<TDocumentDefinitions> => {
  return {
    defaultStyle: {
      fontSize: 10,
      font: 'Arial',
      characterSpacing: -0.7,
      color: '#43484C',
    },
    pageSize: 'A4',
    pageMargins: [30, 25],
    content: [
      {
        text: 'Reporte de Compras',
        style: 'header',
        margin: [0, 0, 0, 20],
      },
      {
        columns: [
          { stack: ['Fecha: 2021-10-10', 'Hora: 12:00:00'], width: 'auto' },
          { text: 'Hora: 12:00:00', width: 'auto' },
        ],
      },
      {
        table: {
          body: [['Producto', 'Cantidad', 'Subtotal']],
        },
        layout: 'lightHorizontalLines',
      },
      {
        text: 'La siguiente gráfica muestra el monto total de compras por fecha:',
        style: 'subheader',
        margin: [0, 0, 0, 10],
      },
    ],
    styles: styles,
  };
};
