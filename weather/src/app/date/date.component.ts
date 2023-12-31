import { Component } from '@angular/core';
import { ShareService } from '../share.service';
import { WeatherService } from '../weather.service';
@Component({
  selector: 'app-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.css']
})
export class DateComponent {
  weekDates : Date[] = [];
  boxDatas :any[] = [];
  location:string = '';
  latitude:number=0;
  longitude:number=0;
  
  temperatureData: any = {};
  sidebarData: any = {}; 
  weatherData: any = {};
  startDate: string = new Date().toISOString().slice(0, 10); 
  endDate: string = new Date(new Date().getTime() + 15 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10); // Default to 16 days from current date

  constructor(private shareService:ShareService,private weatherService: WeatherService) {
    this.calculateWeekDates();
    console.log('box:',this.boxDatas)
  }

  calculateWeekDates() {
    const currentDate = new Date();
    for (let i = 0; i < 16; i++) {
      const nextDate = new Date(currentDate);
      nextDate.setDate(currentDate.getDate() + i);
      this.weekDates.push(nextDate);
    }
  }
  updateDateRange() {
    const startingDate = new Date(this.startDate);
    const endingDate = new Date(this.endDate);
    
    const daysDifference = Math.floor((endingDate.getTime() - startingDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDifference >= 0 && daysDifference <= 15) {
      this.weatherService.getCoordinates(this.latitude, this.longitude, this.startDate, this.endDate).subscribe(data => {
        this.temperatureData = data;
        this.prepareBoxData();
        console.log(data);
      });
    } else {
      this.showAlert();
    }
  }

prepareBoxData() {
  this.boxDatas = [];

  const startDate = new Date(this.startDate);
  const endDate = new Date(this.endDate);

  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const currentDayData = this.getTemperatureDataForDay(currentDate);
    this.boxDatas.push({
      date: currentDate.toDateString(),
      ...currentDayData,
    });

    currentDate = this.nextDate(currentDate);
    console.log('output:',  this.boxDatas)
  }
}
initializeBoxes() {
  const startDate = new Date(this.startDate);
  const endDate = new Date(this.endDate);
  this.weatherService.getCoordinates(this.latitude, this.longitude, this.startDate, this.endDate).subscribe(data => {
    this.temperatureData = data;
    this.prepareBoxData();
  });
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const currentDayData = this.getTemperatureDataForDay(currentDate);
    this.boxDatas.push({
      date: currentDate.toDateString(),
      ...currentDayData,
    });

    currentDate = this.nextDate(currentDate);
  }
  console.log('box data:',this.boxDatas);
}
nextDate(currentDate: Date): Date {
  const nextDay = new Date(currentDate);
  nextDay.setDate(currentDate.getDate() + 1);
  return nextDay;
}

  getTemperatureDataForDay(date: Date): any {
    const times = Math.floor(date.getTime() / 1000);
    const index = this.temperatureData.hourly.time.indexOf(times);
  
    if (index !== -1) {
      return {
        date: date.toDateString(),
        temperature: this.temperatureData.hourly.temperature_2m[index],
        humidity: this.temperatureData.hourly.relativehumidity_2m[index],
      };
    } else {
      return {
        date: date.toDateString(),
        temperature: null,
        humidity: null,
      };
    }
  }

  showAlert() {
    alert('Only a 16-day date range is allowed.');
  }

  ngOnInit() {
    this.shareService.getLocation().subscribe((location) => {
      this.location = location;
      this.initializeBoxes();
      if (location) {
        this.weatherService.getWeatherData(location, 10).subscribe(
          (res: any) => {
            this.sidebarData = res;
            if (res.results && res.results[0]) {
              const latitude = res.results[0].latitude;
              const longitude = res.results[0].longitude;
              this.weatherService.getCoordinates(latitude, longitude, this.startDate, this.endDate).subscribe(
                (response: any) => {
                  this.temperatureData = response;
                  this.prepareBoxData();
                },
                (error: any) => {
                  console.log('Error fetching temperature data:', error);
                }
              );
            }
          },
          (error: any) => {
            console.error('Error fetching weather data:', error);
          }
        );
      }
    });
  }

}
