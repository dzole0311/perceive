import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HighchartsChartModule } from 'highcharts-angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChartComponent } from './components/home/chart/chart.component';
import { CpuLoadComponent } from './components/home/cpu-load/cpu-load.component';
import { SystemOverviewComponent } from './components/home/system-overview/system-overview.component';
import { AboutComponent } from './components/about/about.component';
import { HomeComponent } from './components/home/home.component';
import { IncidentsComponent } from './components/home/incidents/incidents.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ChartModule } from 'angular-highcharts';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ToastrModule } from "ngx-toastr";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ThresholdsComponent } from './components/home/chart/thresholds/thresholds.component';
import { ThresholdStepperComponent } from './components/home/chart/thresholds/threshold-stepper/threshold-stepper.component';

@NgModule({
  declarations: [
    AppComponent,
    ChartComponent,
    CpuLoadComponent,
    SystemOverviewComponent,
    AboutComponent,
    HomeComponent,
    IncidentsComponent,
    SidebarComponent,
    ThresholdsComponent,
    ThresholdStepperComponent
  ],
  imports: [
    ChartModule,
    BrowserModule,
    AppRoutingModule,
    HighchartsChartModule,
    FontAwesomeModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      preventDuplicates: false,
      timeOut: 3000,
      positionClass: 'toast-bottom-right'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
