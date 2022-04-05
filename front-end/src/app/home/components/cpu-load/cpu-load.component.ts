import {ChangeDetectorRef, Component, HostListener, Input, OnChanges, SimpleChanges} from '@angular/core';
import * as Highcharts from 'highcharts';
import { Chart} from "highcharts";
import {SubtitleOptions} from 'highcharts';

@Component({
  selector: 'app-cpu-load',
  templateUrl: './cpu-load.component.html',
  styleUrls: ['./cpu-load.component.scss']
})
export class CpuLoadComponent implements OnChanges {
  @Input() timeSeries: number[][];
  public updateFlag = false;
  // Configs for the subtitle
  private subtitleOptions: SubtitleOptions = {
    align: 'center',
    verticalAlign: 'middle',
    style: {
      'fontSize': '65px'
    },
    y: 95
  };
  // Make Highcharts and the chartOptions public, as they won't be
  // resolved from the component template when using an AOT compiler
  public Highcharts: typeof Highcharts = Highcharts;
  public chart: Chart;
  public chartOptions: Highcharts.Options = {
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
      ...this.subtitleOptions
    },
    credits: {
      enabled: false,
    },
    colors: ['#5C6BC0', '#D1C4E9'],
    tooltip: {
      enabled: false
    },
    plotOptions: {
      pie: {
        innerSize: '80%',
        size: '100%',
      }
    }
  }

  constructor(private ref: ChangeDetectorRef) { }

  ngOnChanges(changes: SimpleChanges) {
    // Update the chart each time the timeSeries @Input gets updated.
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        switch (propName) {
          case 'timeSeries': {
            this.updateCpuLoadChart(this.timeSeries);
          }
        }
      }
    }
  }

  updateCpuLoadChart(timeSeries: number[][]) {
    // Update the CPU load pie chart by taking the most recent item from the timeseries array
    let timeseriesMostRecentItem = timeSeries[timeSeries.length - 1];

    this.chartOptions.series = [{
      data: [timeseriesMostRecentItem[1], 100 - timeseriesMostRecentItem[1] ],
      type: 'pie',
      dataLabels: {
        enabled: false
      }
    }]

    // Update the subtitle centered in the middle of the pie-chart
    this.chartOptions.subtitle = {
      text: timeseriesMostRecentItem[1] > 0 ? Math.round(timeseriesMostRecentItem[1]).toString() + '%' : '0%',
      ...this.subtitleOptions
    };

    this.updateFlag = true;
    // Notify Angular to detect the changes and update the chart
    this.ref.detectChanges();
  }
}
