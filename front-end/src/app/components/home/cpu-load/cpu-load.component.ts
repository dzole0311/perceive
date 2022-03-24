import { Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import * as Highcharts from "highcharts";
import {animate, style, transition, trigger} from "@angular/animations";

let chart: any;

@Component({
  selector: 'app-cpu-load',
  templateUrl: './cpu-load.component.html',
  styleUrls: ['./cpu-load.component.scss'],
  animations: [
    trigger('cardAnimate', [
      transition(':enter', [style({transform: 'scale(0.7)'}), animate('200ms')])
    ])
  ]
})
export class CpuLoadComponent implements OnInit, OnChanges {
  @Input() timeSeriesData: any;

  constructor() { }

  ngOnInit() {
    this.createCpuLoadChart(this.timeSeriesData);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.updateCpuLoadChart(this.timeSeriesData);
  }

  createCpuLoadChart(timeseries: any) {
    chart = Highcharts.chart('chart-pie', {
      chart: {
        type: 'pie',
        renderTo: 'chart-pie'
      },
      credits: {
        enabled: false,
      },
      title: {
        text: 'CPU Load average',
      },
      subtitle: {
        text: '',
        verticalAlign: 'middle',
        style: {
          fontSize: '60px',
          fontFamily: 'Roboto',
          transform: 'translateY(15px)'
        }
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
    } as any);
  }

  updateCpuLoadChart(timeSeriesData: any) {
    if (!chart) return;
    chart.series[1].setData([timeSeriesData.value, 100 - timeSeriesData.value]);
    chart.setSubtitle({text: Math.round(timeSeriesData.value).toString() + '%'});
  }

}
