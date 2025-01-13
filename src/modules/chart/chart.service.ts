import { Injectable } from '@nestjs/common';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import {
  Chart,
  ChartConfiguration,
  ChartType,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

@Injectable()
export class ChartService {
  private chartJSNodeCanvas: ChartJSNodeCanvas;

  constructor() {
    const width = 800;
    const height = 600;

    Chart.register(
      CategoryScale,
      LinearScale,
      BarElement,
      Title,
      Tooltip,
      Legend,
    );

    this.chartJSNodeCanvas = new ChartJSNodeCanvas({
      width,
      height,
    });
  }

  async generateChart(
    type: ChartType,
    data: { labels: string[]; datasets: any[] },
    options: ChartConfiguration['options'] = {},
  ): Promise<Buffer> {
    try {
      const configuration: ChartConfiguration = {
        type,
        data,
        options,
      };

      return await this.chartJSNodeCanvas.renderToBuffer(configuration);
    } catch (error) {
      throw new Error(`Error al generar el gráfico: ${error.message}`);
    }
  }
}
