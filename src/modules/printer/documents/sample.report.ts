import type { StyleDictionary, TDocumentDefinitions } from 'pdfmake';

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

export const prescriptionPDF = async (
  data: any,
): Promise<TDocumentDefinitions> => {
  return {
    defaultStyle: {
      fontSize: 10,
      font: 'Arial',
      characterSpacing: -0.7,
      color: '#43484C',
    },
    pageSize: 'A4',
    pageMargins: [30, 25],
    content: [],

    styles: styles,
  };
};
