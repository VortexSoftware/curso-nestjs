import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { ExcelColumn } from 'src/common/interfaces';

@Injectable()
export class ExcelService {
  async generateExcel(
    data: any[],
    columns: ExcelColumn[],
    sheetName: string = 'Sheet1',
  ) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetName);

    worksheet.columns = columns;

    worksheet.getRow(1).font = { bold: true };

    data.forEach((item) => {
      worksheet.addRow(item);
    });

    worksheet.columns.forEach((column) => {
      const maxLength = (column.values || []).reduce(
        (max: number, value: any) => {
          if (value && value.toString().length > max) {
            return value.toString().length;
          }
          return max;
        },
        0,
      );
      column.width = maxLength < 10 ? 10 : maxLength + 2;
    });

    return workbook;
  }

  async exportToResponse(res, workbook: ExcelJS.Workbook, filename: string) {
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    await workbook.xlsx.write(res);
    res.end();
  }

  async readExcel(buffer: Buffer): Promise<any[]> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);
    const worksheet = workbook.worksheets[0];

    const headers: string[] = [];
    worksheet.getRow(1).eachCell((cell) => {
      headers.push(cell.value?.toString() || '');
    });

    const data: any[] = [];

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;

      const rowData: any = {};
      row.eachCell((cell, colNumber) => {
        const header = headers[colNumber - 1];
        if (header) {
          rowData[header] = cell.value;
        }
      });

      data.push(rowData);
    });

    return data;
  }
}
