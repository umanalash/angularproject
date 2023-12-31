import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShareService {
  temperatureData:any;
  weatherData: any;
  private selectedLocationSource$ = new BehaviorSubject<{ latitude: number, longitude: number }>({ latitude: 0, longitude: 0 });
  selectedLocation$ = this.selectedLocationSource$.asObservable();

    private locationSubject = new BehaviorSubject<string>('');
  setTemperatureData(data: any) {
    this.temperatureData = data;
    console.log('sunrise Data set:', this.temperatureData);
  }
  
  getTemperatureData() {
    console.log('sunriseset Data set:', this.temperatureData);
    return this.temperatureData;
  }

  setWeatherData(data: any) {
    this.weatherData = data;
    console.log('Tempterature Data set:', this.weatherData);
  }

  getWeatherData() {
    console.log('tempt:',this.weatherData);
    return this.weatherData;
  }

  setLocation(location: string) {
    this.locationSubject.next(location);
  }

  getLocation(): Observable<string> {
    return this.locationSubject.asObservable();
  }
  emitSelectedLocation(location: { latitude: number, longitude: number }) {
    this.selectedLocationSource$.next(location);
  }
  
}