import { Component,OnInit } from '@angular/core';
import { WeatherService } from '../weather.service';
import { ShareService } from '../share.service';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.css']
})
export class ForecastComponent implements OnInit{
  location:string = 'Thenkasi';
  latitude:number=0;
  longitude:number=0;
  temperatureData:any={};
  weatherData: any = {};
  date=new Date();
  filteredPlace: any[] = []; 
  selectedFilter:any;
  count:any[]=[];
  selectedIndex: number = -1;
  startDate: string = ''; 
  endDate: string = '';
  showList:boolean=true;
  isMapVisible=true;
  
  constructor(
    private weatherservice: WeatherService,private shareService: ShareService, private router:Router) { 
      /* this.shareService.markerClick$.subscribe(markerCoordinates => {
        this.weatherservice.getCoordinates(markerCoordinates.latitude, markerCoordinates.longitude, this.startDate, this.endDate)
          .subscribe((forecastData: any) => {
            console.log('Received Forecast Data:', forecastData);
            this.shareService.setTemperatureData(forecastData);
            this.updateForecastData(forecastData);
          });
        });*/
    }

    ngOnInit(): void {
      this.startDate = this.getFormattedDate(new Date()); 
      this.endDate = this.getFormattedDate(new Date()); 
      this.searchWeather();
    }
    onSearchButtonClick() {
      this.shareService.setLocation(this.location);
      this.showList = false;
      this.searchWeather();
    }
    getFormattedDate(date: Date): string {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      console.log(date);
      return `${year}-${month}-${day}`;
    }
    updateForecastData(weatherData: any): void {
      this.temperatureData = weatherData.temperature;
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
   
onLocationChange(value: string) {
  if (value.trim() === '') {
    this.filteredPlace = [];
    this.showList = false;
    this.selectedIndex = -1; 
  } else {
    this.weatherservice.getWeatherData(value, 10).subscribe(response => {
      this.filteredPlace = response.results;
      this.showList = true; 
      this.selectedIndex = -1; 
    });
  }
}
    selectPlace(filter:any) {
      this.location = filter.name;
      this.selectedFilter = filter;
      this.filteredPlace=[];
      this.showList=false;
      this.searchWeather();
      this.selectedIndex = -1; 
      this.shareService.setLocation(this.location);
      this.router.navigate(['/map']);
    }
   
    onKeyDown(event: KeyboardEvent) {
      console.log('Key pressed:', event.key);

      if (event.key === 'Enter') {
        this.onEnterKey();
      } else if (event.key === 'ArrowUp') {
        this.moveSelection(-1);
      } else if (event.key === 'ArrowDown') {
        this.moveSelection(1);
      }
    }
  
    moveSelection(step: number) {
      const newIndex = this.selectedIndex + step;
      if (newIndex >= 0 && newIndex < this.filteredPlace.length) {
        this.selectedIndex = newIndex;
      }
    }
  
    onEnterKey() {
      if (this.selectedIndex !== -1) {
        this.selectPlace(this.filteredPlace[this.selectedIndex]);
        this.showList = false;
        this.selectedIndex = -1;
        console.log('enter the key pressed');
      } else {
        this.onSearchButtonClick();
      }
      this.showList=false;
    }
   
    onClickOutside() {
      this.showList=false;
      this.selectedIndex=-1;
    }
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
      case 45:
        description='Fog';
        break;
      case 48:
        description='Despositing rime fog';
        break;
      case 51:
        description='Light drizzle';
        break;
      case 53:
        description='Moderate drizzle';
        break;
      case 55:
        description='Dense drizzle';
        break;
      case 56:
        description='Light freezing drizzle';
        break; 
      case 57:
        description='Dense freezing drizzle density';
        break;
      case 61:
        description='Slight rain';
        break;
      case 63:
        description='Moderate rain';
        break;
      case 65:
        description='Heavy intensity rain';
        break;
      case 71:
        description='Slight snowfall';
        break;
      case 73:
        description='Moderate snowfall';
        break;
      case 75:
        description='Heavy snowfall';
        break;
      case 77:
        description='Snow grains';
        break;
      case 80:
        description='Slight rain showers';
        break;
      case 81:
        description='Moderate rain showers';
        break;
      case 82:
        description='Violent';
        break;
      case 95:
        description='Thunderstorm';
        break;
      default:
        description = 'Unknown';
        break;
    };
    return description;
    }
}
