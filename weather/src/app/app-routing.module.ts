import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForecastComponent } from './forecast/forecast.component';
import { MapComponent } from './map/map.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { DateComponent } from './date/date.component';
import { UpdateComponent } from './update/update.component';
import { LineChartComponent } from './line-chart/line-chart.component';

const routes: Routes = [
  { path: 'forecast',component:ForecastComponent}, 
  { path: 'forecast', component: ForecastComponent }, 
  { path: 'update', component: UpdateComponent }, 
  { path: 'side', component: SidebarComponent }, 
  { path: 'map', component: MapComponent }, 
  { path: 'date', component: DateComponent }, 
  { path: 'graph', component: LineChartComponent }, 

];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
