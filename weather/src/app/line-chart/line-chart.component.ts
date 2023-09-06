import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { ShareService } from '../share.service';
import { WeatherService } from '../weather.service';
@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit{
  public chart:any; 
  location:string='Thenkasi';
  latitude:number=0;
  longitude:number=0;
  startDate:string='';
  endDate:string='';
  temperatureData:number[]=[];
  humidityData:number[]=[];
  constructor(private shareService:ShareService,private weatherService:WeatherService) { }
  ngOnInit(): void {
    this.temperatureData = this.shareService.getTemperatureData();
    this.humidityData = this.shareService.getWeatherData();
    console.log('Temp data:',this.temperatureData);
    console.log('Humi data:',this.humidityData);
    this.createChart();
    this.searchTemp();
  }
  searchTemp() {
    this.weatherService.getCoordinates(this.latitude,this.longitude,this.startDate,this.endDate).subscribe((data: any) => {
      // Extract temperature data from the response.
      const temperature = data.hourly.temperature_2m[0];
      // Update the chart with the new data.
    });
  }


  createChart(){
    const dateLabels = [];
    const currentDate = new Date();
    
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    for (let i = 0; i <= 6; i++) {
      const date = new Date(currentDate);
      date.setDate(currentDate.getDate() + i);
    
      const dayOfWeekNumber = date.getDay();
  
      const formattedLabel = `${date.toISOString().split('T')[0]} (${daysOfWeek[dayOfWeekNumber]})`;
      dateLabels.push(formattedLabel); 
    }
    

    this.chart = new Chart("MyChart", {
      type: 'line',

      data: {
        labels:dateLabels, 
	       datasets: [
          {
            label: "Temperature",
            data:[],
            backgroundColor: 'blue'
          },
          {
            label: "Humidity",
            data:[],
            backgroundColor: 'limegreen'
          }  
        ]
      },
      options: {
        aspectRatio:2.2,
        scales: {
       
          x: {
            display: true,
            title: {
              display: true,
              text: 'Date'
            },
            grid: {
              color: 'rgba(0,0,0,0.1)',
            }
          },
          y: {
            display: true,
            beginAtZero: false,
            min: 5, 
            suggestedMax: 30, 
            grid: {
              color: 'rgba(0,0,0,0.1)',
            },
            ticks: {
              stepSize: 5, 
              font: {
                size: 14,
                weight: 'bold',
              }
            },
            title: {
              display: true,
              text: 'Temperature(°C) and Humidity(%)'
            }
          }
        },
        plugins:{
          tooltip:{
            backgroundColor:'rgba(0,0,0,0.7)',
            bodyFont:{
              size:14,
              weight:'bold',
            },
            titleFont:{
              size:16,
              weight:'bold'
            },
           
          },
          legend:{
            labels:{
              font:{
                size:20,
              }
            }
          },
        }
      }
    });
  
  }
}
 
