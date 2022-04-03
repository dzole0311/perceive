import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HighchartsChartModule } from 'highcharts-angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { ChartModule } from 'angular-highcharts';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ToastrModule } from "ngx-toastr";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {HomeModule} from "./home/home.module";
import {AboutModule} from "./about/about.module";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent
  ],
  imports: [
    HomeModule,
    AboutModule,
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
