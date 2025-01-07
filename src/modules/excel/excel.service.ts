import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';

@Injectable()
export class ExcelService {
  async generateExcel(data, columns: any[], sheetName: string = 'Sheet1') {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetName);

    worksheet.columns = columns;

    worksheet.getRow(1).font = { bold: true };

    data.forEach((item) => {
      worksheet.addRow(item);
    });

    worksheet.columns.forEach((column) => {
      const maxLength = column.values.reduce((max: number, value: any) => {
        if (value && value.toString().length > max) {
          return value.toString().length;
        }
        return max;
      }, 0);
      column.width = maxLength < 10 ? 10 : maxLength + 2;
    });

    return workbook;
  }

  async exportToResponse(
    res: any,
    workbook: ExcelJS.Workbook,
    filename: string,
  ) {
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    await workbook.xlsx.write(res);
    res.end();
  }
}
