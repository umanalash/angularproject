import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class WeatherService {

  constructor(private http: HttpClient) {}

  getWeatherData(location:string,count:number): Observable<any> {
    const url = ` https://geocoding-api.open-meteo.com/v1/search?name=${location}&count=${count}&language=en&format=json`;
    return this.http.get(url);
  }
  getCoordinates(latitude:number,longitude:number,startDate:string,endDate:string): Observable<any>{
    const url1 = ` https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,relativehumidity_2m,windspeed_10m&daily=sunrise,sunset,uv_index_max&timezone=GMT&start_date=${startDate}&end_date=${endDate}`;
    return this.http.get(url1);
  }
}

