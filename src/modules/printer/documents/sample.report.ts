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

export const generatePDF = async (
  chartBuffer: Buffer,
): Promise<TDocumentDefinitions> => {
  const chartBase64 = chartBuffer.toString('base64');
  const chartImage = `data:image/png;base64,${chartBase64}`;

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
        text: 'La siguiente gráfica muestra el monto total de compras por fecha:',
        style: 'subheader',
        margin: [0, 0, 0, 10],
      },
      {
        image: chartImage,
        width: 500,
        alignment: 'center',
        margin: [0, 10, 0, 20],
      },
    ],
    styles: styles,
  };
};
