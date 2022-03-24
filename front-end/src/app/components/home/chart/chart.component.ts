import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import * as Highcharts from 'highcharts';

interface Message {
  timeSeries: {
    timestamp: number,
    value: number
  },
  systemOverview: {
    platform: any,
    uptime: number,
    cpuCount: number
  }
}

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit, OnChanges {
  @Input() timeSeriesData: any;
  private chart: any;

  constructor() {
  }

  ngOnInit(): void {
    this.createChartLine();
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes.timeSeriesData.currentValue, 'ovde');
    this.updateChartLine();
  }

  getEmptyData() {
    let interval = 10000, // 10 second,
      numberOfPoints = 50,
      now = (new Date()).getTime(),
      min = now - interval * numberOfPoints,
      points = [];

    while (min <= now) {
      points.push([min, null]); // set null points
      min += interval;
    }
    return points;
  }

  private createChartLine(): void {
    let data: any[] = [];
    //
    // for (let i = 0; i <= 999; i++) {
    //   data.push({
    //     x: new Date().getTime() - i * 600,
    //     y: null
    //   });
    // }

    // data.reverse();

    data = this.getEmptyData();

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
        type: 'datetime'
      },
      tooltip: {
        headerFormat: `<div>Date: {point.key}</div>`,
        pointFormat: `<div>{series.name}: {point.y}</div>`,
        shared: true,
        useHTML: true,
      },
      plotOptions: {
        series: {
          animation: true,
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
      responsive: {
        rules: [
          {
            chartOptions: {
              // Hide various elements on mobile
              title: { text: '' },
              tooltip: {
                enabled: false,
              },
              xAxis: {
                crosshair: { width: 0 },
              },
            },
            condition: { maxWidth: 300 },
          },
        ],
      },
      time: {
        useUTC: false,
      },
      series: [{
        name: "CPU Load",
        color: '#ffffff',
        breakSize: 2,
        fillColor: {
          linearGradient: {x1: 0, y1: 0, x2: 0, y2: 1},
          stops: [
            [0, 'rgb(63, 81, 181)'],
            [1, 'rgb(92, 107, 192, 0.7)']
          ]
        },
        data: this.getEmptyData()
      }],
    } as any);
  }

  updateChartLine() {
    if (!this.chart) return;
    console.log(this.timeSeriesData.timestamp, 'ovde 2');
    this.chart.series[0].addPoint([this.timeSeriesData.timestamp, this.timeSeriesData.value], true, true);
  }
}
