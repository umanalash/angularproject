import { Component, OnInit,AfterViewInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { ShareService } from '../share.service';
import { WeatherService } from '../weather.service';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit,AfterViewInit {
  public chart:any; 
  location:string='Thenkasi';
  latitude:number=0;
  longitude:number=0;
  startDate:string='';
  endDate:string='';
  weatherData:any = null;
  temperatureData:number[]| null = null;
  humidityData:number[]| null = null;
  constructor(private shareService:ShareService,private weatherService:WeatherService) { }
  
  ngOnInit(): void { 
    this.location='Thenkasi';
    this.createChart();
  }
  
  ngAfterViewInit(): void {
    const currentDate = new Date();
    this.startDate = currentDate.toISOString().split('T')[0];

    const endDate = new Date(currentDate);
    endDate.setDate(currentDate.getDate() + 6);
    this.endDate = endDate.toISOString().split('T')[0];

    this.shareService.getLocation().subscribe(location => {
      this.location = location; 
      console.log('ngAfterViewInit executed',this.location);
      this.searchTemp();
    },(error) => {
      console.log('error:',error)
    }
    );
  }

  searchTemp() {
  this.weatherService.getWeatherData(this.location,10).subscribe(res => {
  this.weatherData = res;
  console.log("WeatherData:", res);
  if (res.results && res.results[0] ) {
    this.latitude = res.results[0].latitude;
    this.longitude = res.results[0].longitude;
    console.log('Current Location:', this.location);


    this.weatherService.getCoordinates(this.latitude, this.longitude,this.startDate,this.endDate).subscribe(response => {
      this.temperatureData = response.hourly.temperature_2m;
      this.humidityData = response.hourly.relativehumidity_2m;
      this.location = res.results[0].name;
    console.log('Tempte Data:', this.temperatureData);
      console.log('Updated Location:', this.location);
      this.createChart();
    });
        this.updateChartTemperatureData();
      } else {
        console.error('Hourly data not found in API response');
      }
    },(error) => {
      console.error('Error fetching weather data:', error);
    });
  
  }

  updateChartTemperatureData() {
 
    if (this.chart) {
      this.chart.data.datasets[0].data = this.temperatureData;
      this.chart.data.datasets[1].data =this. humidityData;
      this.chart.update();
    }
  }

  
  createChart(){
    if (this.chart) {
      this.chart.destroy();
    }
  
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
            data:this.temperatureData,
            backgroundColor: 'blue'
          },
          {
            label: "Humidity",
            data:this.humidityData,
            backgroundColor: 'limegreen'
          }  
        ]
      },
      options: {
        aspectRatio:2.5,
        scales: {
       
          x: {
            display: true,
            title: {
              display: true,
              text: 'Date',
              font : {
                size:23
              }
            },
            grid: {
              color: 'rgba(0,0,0,0.1)',
            },
            ticks: {
              font: {
                size: 17,
                weight: 'bold',
              }
            },
          },
          y: {
            display: true,
            beginAtZero: false,
            min:10, 
            suggestedMax:100, 
            grid: {
              color: 'rgba(0,0,0,0.1)',
            },
            ticks: {
              stepSize: 10, 
              font: {
                size: 17,
                weight: 'bold',
              }
            },
            title: {
              display: true,
              text: 'Temperature(°C) and Humidity(%)',
              font : {
                size:23
              }
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
            display:true,
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
