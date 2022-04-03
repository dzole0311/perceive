import { Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import * as Highcharts from "highcharts";

@Component({
  selector: 'app-cpu-load',
  templateUrl: './cpu-load.component.html',
  styleUrls: ['./cpu-load.component.scss']
})
export class CpuLoadComponent implements OnInit, OnChanges {
  @Input() timeSeries: number[][];
  private chart: Highcharts.Chart;

  constructor() { }

  ngOnInit() {
    this.createCpuLoadChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.updateCpuLoadChart(this.timeSeries);
  }

  createCpuLoadChart() {
    this.chart = Highcharts.chart('chart-pie', {
      chart: {
        type: 'pie',
        renderTo: 'chart-pie'
      },
      title: {
        text: 'CPU Load average',
        align: 'left',
        margin: 50,
        style: {
          fontWeight: 'bold'
        }
      },
      subtitle: {
        text: '',
        verticalAlign: 'middle',
        style: {
          fontSize: '60px',
          fontFamily: 'Roboto',
          transform: 'translateY(35px)'
        }
      },
      credits: {
        enabled: false,
      },
      colors: ['#5C6BC0', '#D1C4E9'],
      tooltip: {
        enabled: false
      },
      series: [{
        size: '0',
        name: 'Versions',
        data: []
      }, {
        innerSize: '80%',
        cursor: 'pointer',
        dataLabels: {
          enabled: false
        },
        name: 'CPU usage',
        data: [{
          name: 'CPU usage',
          y: 0,
          selected: true,
        }, {
          name: '',
          y: 0
        }]
      }]
    } as {});
  }

  updateCpuLoadChart(timeSeries: number[][]) {
    if (!this.chart || !timeSeries) return;
    // Update the CPU load pie chart by taking the most recent item from the timeseries array
    let timeseriesMostRecentItem = timeSeries[timeSeries.length - 1];
    this.chart.series[1].setData([timeseriesMostRecentItem[1], 100 - timeseriesMostRecentItem[1]]);
    // Update the subtitle which is centered in the middle of the pie-chart
    this.chart.setSubtitle({text: Math.round(timeseriesMostRecentItem[1]).toString() + '%'});
  }
}
