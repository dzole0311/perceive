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
import { HeaderComponent } from './components/header/header.component';
import { ChartModule } from 'angular-highcharts';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ToastrModule } from "ngx-toastr";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { PlatformComponent } from './components/home/system-overview/platform/platform.component';
import { CpuCountComponent } from './components/home/system-overview/cpu-count/cpu-count.component';
import { UptimeComponent } from './components/home/system-overview/uptime/uptime.component';
import { FreeMemoryComponent } from './components/home/system-overview/free-memory/free-memory.component';
import { CardMediaComponent } from './components/home/system-overview/card-media/card-media.component';

@NgModule({
  declarations: [
    AppComponent,
    ChartComponent,
    CpuLoadComponent,
    SystemOverviewComponent,
    AboutComponent,
    HomeComponent,
    IncidentsComponent,
    HeaderComponent,
    PlatformComponent,
    CpuCountComponent,
    UptimeComponent,
    FreeMemoryComponent,
    CardMediaComponent
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
      iconClasses: {
        success: 'toast--success',
        info: 'toast--info'
      },
      positionClass: 'toast-bottom-right'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
