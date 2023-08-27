import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShareService {
  temperatureData:any={};
  weatherData: any = {};
    private locationSubject = new BehaviorSubject<string>('');
  setTemperatureData(data: any) {
    this.temperatureData = data;
  }
  
  getTemperatureData() {
    return this.temperatureData;
  }

  setWeatherData(data: any) {
    this.weatherData = data;
  }

  getWeatherData() {
    return this.weatherData;
  }

  setLocation(location: string) {
    this.locationSubject.next(location);
  }

  getLocation(): Observable<string> {
    return this.locationSubject.asObservable();
  }
}