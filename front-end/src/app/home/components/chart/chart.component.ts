import {ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import * as Highcharts from 'highcharts';
import {CPU_HIGH_LOAD_THRESHOLD} from '../../../shared/constants/constants';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnChanges {
  @Input() timeSeries: number[][];
  public updateFlag = false;
  // Make Highcharts and the chartOptions public, as they won't be resolved from the
  // component template when using an AOT compiler
  public Highcharts: typeof Highcharts = Highcharts;
  public chartOptions: Highcharts.Options = {
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
        // Hide the yAxis title by setting it's text to null
        text: null
      },
      min: 0,
      max: 100,
      labels: {
        format: '{value}%'
      },
      plotLines: [{
        color: '#FF0000',
        width: 1,
        zIndex: 1,
        value: CPU_HIGH_LOAD_THRESHOLD
      }]
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
      shared: true,
      backgroundColor: "#ffffff",
      borderWidth: 1,
      borderRadius: 1,
      borderColor: '#E0E0E0',
      shadow: false,
      useHTML: true,
      // Allow the tooltip to flow outside, along
      // the edges of the chart
      outside: true,
      style: {
        fontSize: '16px',
        fontFamily: 'Roboto'
      },
      formatter: function () {
        return `<div class="tooltip">
                    <div class="tooltip__box">
                        <span class="tooltip__description">CPU load: </span>
                        <span class="tooltip__value"><strong>${Math.round(<number>this.y)}%</strong></span>
                    </div>
                      <div class="tooltip__box">
                        <span class="tooltip__description">Time: </span>
                        <span class="tooltip__value"><strong>${new Date(<number>this.x).toLocaleTimeString()}</strong></span>
                    </div>
                </div>`
      },
      valueDecimals: 2
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
      data: [],
      type: 'area',
      name: 'Average CPU load',
      color: 'rgb(92, 107, 192, 0.7)',
      fillColor: {
        linearGradient: {x1: 0, y1: 0, x2: 0, y2: 1},
        stops: [
          [0, 'rgb(63, 81, 181)'],
          [1, 'rgb(92, 107, 192, 0.7)']
        ]
      },
    }]
  };

  constructor(private ref: ChangeDetectorRef) {
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

  updateChartLine() {
    this.chartOptions.series = [
      {
        data: this.timeSeries,
        type: 'area',
        name: 'Average CPU load',
        color: 'rgb(92, 107, 192, 0.7)',
        fillColor: {
          linearGradient: {x1: 0, y1: 0, x2: 0, y2: 1},
          stops: [
            [0, 'rgb(63, 81, 181)'],
            [1, 'rgb(92, 107, 192, 0.7)']
          ]
        },
      }
    ]

    this.updateFlag = true;
    // Notify Angular to detect the changes and update the chart
    this.ref.detectChanges();
  }
}
