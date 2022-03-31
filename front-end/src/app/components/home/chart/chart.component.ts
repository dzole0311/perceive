import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import * as Highcharts from 'highcharts';

interface PlotBand {
  from: number,
  to: number,
  id: number | string,
  color: string
}

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit, OnChanges {
  @Input() timeSeriesData: any;
  private chart: any;
  private plotBands: PlotBand[];
  private previousValueWasBigger = false;
  private j = 0;

  constructor() {
  }

  ngOnInit(): void {
    this.createChartLine();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.updateChartLine();
  }

  private createChartLine(): void {
    this.chart = Highcharts.chart('chart-line', {
      chart: {
        type: 'area',
        renderTo: 'chart-line'
      },
      title: {
        text: 'CPU Load History',
      },
      credits: {
        enabled: false,
      },
      legend: {
        enabled: true,
        align: "right",
      },
      yAxis: {
        min: 0,
        max: 100,
        labels: {
          format: '{value}%'
        },
        plotLines: [{
          color: '#FF0000',
          width: 2,
          value: 20
        }]
      },
      xAxis: {
        type: 'datetime',
        crosshair: {
          width: 1,
          color: 'red',
          zIndex: 3,
        }
      },
      tooltip: {
        headerFormat: `<div>Date: {point.key}</div>`,
        pointFormat: `<div>{series.name}: {point.y}</div>`,
        valueDecimals: 2,
        shared: true,
        useHTML: true,
      },
      plotOptions: {
        series: {
          marker: {
            enabled: false
          },
          states: {
            hover: {
              enabled: false,
            },
            inactive: {
              enabled: false,
            },
          },
        },
      },
      time: {
        useUTC: false,
      },
      series: [{
        name: "CPU Load",
        breakSize: 2,
        color: 'rgb(63, 81, 181)',
        fillColor: {
          linearGradient: {x1: 0, y1: 0, x2: 0, y2: 1},
          stops: [
            [0, 'rgb(63, 81, 181)'],
            [1, 'rgb(92, 107, 192, 0.7)']
          ]
        },
        data: this.timeSeriesData
      }],
    } as any);
  }

  updateChartLine() {
    if (!this.chart) return;
    // this.generatePlotBands();
    this.chart.series[0].setData(this.timeSeriesData);
  }

  generatePlotBands() {
    let plotBand: PlotBand = {from: 0, to: 0, id: 0, color: '#F0F0C0'};

    for (let i = 0; i < this.timeSeriesData.length - 1; i++) {
      if (this.timeSeriesData[i][1] >= 15 && !this.previousValueWasBigger) {
        plotBand.from = this.timeSeriesData[i][0];
        this.previousValueWasBigger = !this.previousValueWasBigger;
      } else if (this.timeSeriesData[i][1] < 15 && this.previousValueWasBigger || i === this.timeSeriesData.length - 1) {
        if (this.timeSeriesData[i][1] >= 15 && this.timeSeriesData.length - 1 === i) {
          plotBand.to = this.timeSeriesData[i - 1][0];
        } else {
          plotBand.to = this.timeSeriesData[i][0];
        }
        this.previousValueWasBigger = !this.previousValueWasBigger;
        plotBand.id = 'plot-band-' + this.j;
        this.chart.xAxis[0].addPlotBand(plotBand);
        this.j++;
      }
    }
  }
}
