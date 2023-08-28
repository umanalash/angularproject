import { Component } from '@angular/core';
import { WeatherService } from '../weather.service';
import { ShareService } from '../share.service';

@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.css']
})
export class ForecastComponent {
  location:string = 'Thenkasi';
  latitude:number=0;
  longitude:number=0;
  temperatureData:any={};
  weatherData: any = {};
  date=new Date();
  filteredPlace:any[]=[];
  count:any[]=[];
  startDate: string = ''; 
  endDate: string = '';
  constructor(
    private weatherservice: WeatherService,private shareService: ShareService) { }

    ngOnInit(): void {
      this.startDate = this.getFormattedDate(new Date()); 
      this.endDate = this.getFormattedDate(new Date()); 
      this.searchWeather();
    }
    getFormattedDate(date: Date): string {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      console.log(date);

      return `${year}-${month}-${day}`;
    }
    searchWeather() {
      this.weatherservice.getWeatherData(this.location,10).subscribe(res => {
        this.weatherData = res;
        console.log("WeatherData:", res);
        if (res.results && res.results[0] ) {
          this.latitude = res.results[0].latitude;
          this.longitude = res.results[0].longitude;
          console.log('Current Location:', this.location);
  
          
        this.shareService.setLocation(this.location); 

          this.weatherservice.getCoordinates(this.latitude, this.longitude,this.startDate,this.endDate).subscribe(response => {
            this.temperatureData = response;
            this.location = this.weatherData.results[0].name;
            this.shareService.setTemperatureData(this.temperatureData);
            this.shareService.setWeatherData(res);
            console.log('Temperature Data:', response);
            console.log('Updated Location:', this.location);
          });
        }
      });
    }
   /* changePlace(value:string) {
      if(value.trim()=== '') {
        this.filteredPlace = [];
      }
      this.weatherservice.getWeatherData(value,10).subscribe(response => {
        this.filteredPlace=response.results;
      });
    }
    selectPlace(city:any) {
      this.location = this.location;
      this.filteredPlace=[];
      this.searchWeather();
    }*/
    getWeatherDescription(weatherCode: number): string {
      let description:string;

      switch(weatherCode) {
      case 0:
        description='Clear sky';
        break;
      case 1:
        description='Mainly clear';
        break;
      case 2:
        description='Light clouds';
        break;
      case 3:
        description='Partly cloudy';
        break;
      default:
        description = 'Unknown';
        break;
    };
    return description;
  }
}
