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
    console.log('Weathderdayta:',url)
    return this.http.get(url);
  }
  getCoordinates(latitude:number,longitude:number,startDate:string,endDate:string): Observable<any>{
    const url1 = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=pressure_msl,temperature_2m,relativehumidity_2m,weathercode,windspeed_10m&daily=sunrise,sunset,weathercode,temperature_2m_max,temperature_2m_min,uv_index_max,precipitation_sum,rain_sum,showers_sum,snowfall_sum&timezone=auto&start_date=${startDate}&end_date=${endDate}&forecast_days=16`;
    console.log(url1);

    return this.http.get(url1);
  }
} 