import { Component, OnInit } from '@angular/core';
import { ShareService } from '../share.service';
@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateComponent implements OnInit{
  location:string='Thenkasi';
  temperatureData:any={};

  constructor(private shareService:ShareService) { }

  ngOnInit(): void {
    this.temperatureData = this.shareService.getTemperatureData();
    console.log(this.temperatureData);
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
