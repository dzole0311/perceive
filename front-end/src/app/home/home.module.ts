import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ChartComponent} from "./components/chart/chart.component";
import {CpuLoadComponent} from "./components/cpu-load/cpu-load.component";
import {IncidentsComponent} from "./components/incidents/incidents.component";
import {SystemOverviewComponent} from "./components/system-overview/system-overview.component";
import {HomeComponent} from "./components/home.component";
import {CpuCountComponent} from "./components/system-overview/cpu-count/cpu-count.component";
import {UptimeComponent} from "./components/system-overview/uptime/uptime.component";
import {PlatformComponent} from "./components/system-overview/platform/platform.component";
import {FreeMemoryComponent} from "./components/system-overview/free-memory/free-memory.component";
import {CardMediaComponent} from "./components/system-overview/card-media/card-media.component";

@NgModule({
  declarations: [
    HomeComponent,
    ChartComponent,
    CpuLoadComponent,
    IncidentsComponent,
    SystemOverviewComponent,
    CardMediaComponent,
    CpuCountComponent,
    UptimeComponent,
    PlatformComponent,
    FreeMemoryComponent
  ],
  imports: [
    CommonModule
  ]
})
export class HomeModule { }
