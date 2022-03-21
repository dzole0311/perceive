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
import { NavbarComponent } from './components/navbar/navbar.component';

@NgModule({
  declarations: [
    AppComponent,
    ChartComponent,
    CpuLoadComponent,
    SystemOverviewComponent,
    AboutComponent,
    HomeComponent,
    IncidentsComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HighchartsChartModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
