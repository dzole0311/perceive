import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import * as Highcharts from 'highcharts';
import {CpuLoadMonitorService} from '../../../shared/services/cpu-load-monitor.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit, OnChanges {
  @Input() timeSeries: number[][];
  private chart: Highcharts.Chart;

  constructor(private cpuMonitoringService: CpuLoadMonitorService) {
  }

  ngOnInit(): void {
    // Initialize the area chart
    this.createChartLine();
  }

  ngOnChanges(changes: SimpleChanges) {
    // Update the chart each time the timeSeries @Input gets updated.
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        switch (propName) {
          case 'timeSeries': {
            this.updateChartLine();
          }
        }
      }
    }
  }

  createChartLine(): void {
    this.chart = Highcharts.chart('area-chart', {
      chart: {
        type: 'area'
      },
      title: {
        text: 'CPU Load History',
        align: 'left',
        margin: 50,
        style: {
          fontWeight: 'bold'
        }
      },
      credits: {
        enabled: false,
      },
      legend: {
        enabled: true,
        align: "right",
      },
      yAxis: {
        title: {
          enabled: false
        },
        min: 0,
        max: 100,
        labels: {
          format: '{value}%'
        }
      },
      xAxis: {
        type: 'datetime',
        minPadding: 0,
        maxPadding: 0,
        crosshair: {
          width: 1,
          color: '#EDE7F6',
          zIndex: 3,
        }
      },
      tooltip: {
        headerFormat: `<div>Time: {point.key}</div>`,
        pointFormat: `<div>{series.name}: {point.y}</div>`,
        valueDecimals: 2,
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
        color: 'rgb(92, 107, 192, 0.7)',
        fillColor: {
          linearGradient: {x1: 0, y1: 0, x2: 0, y2: 1},
          stops: [
            [0, 'rgb(63, 81, 181)'],
            [1, 'rgb(92, 107, 192, 0.7)']
          ]
        },
        data: this.timeSeries
      }],
    } as {});
  }

  updateChartLine() {
    if (!this.chart) return;
    this.chart.series[0].setData(this.timeSeries);
  }
}
