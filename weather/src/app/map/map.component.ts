// map.component.ts
import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { ShareService } from '../share.service';
import { WeatherService } from '../weather.service';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  map!: L.Map;
  isMapVisible = false;
  latitude:number=0;
  longitude:number=0;
  marker!:L.Marker;
  location:string='';
  constructor(private weatherService:WeatherService, private shareService:ShareService) {}
  ngOnInit(): void {
    this.shareService.getLocation().subscribe(location => {
      if (location) {
        this.searchLocationOnMap(location);
      }
    });
      this.initializeMap();
  }
  searchLocation() {
    this.weatherService.getWeatherData(this.location, 10).subscribe((data: any) => {
      console.log('Weather Data:', data);

      const latitude = data.results[0].latitude;
      const longitude = data.results[0].longitude;
      const zoomLevel = 12; 

      this.map.setView([latitude, longitude], zoomLevel);

      L.marker([latitude, longitude]).addTo(this.map)
        .bindPopup('Location: ' + this.location) 
        .openPopup();
    }, (error: any) => {
      console.error('Error fetching weather data:', error);
    });
  }
  initializeMap(): void {
    if(!this.map){
    this.map = L.map('map').setView([51.505, -0.09], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);
  }
  }  

 
  toggleMapVisibility(): void {
    this.isMapVisible = !this.isMapVisible;
  
  }
 
  searchLocationOnMap(location: string): void {
    if (location) {
      const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${location}&count=1&language=en&format=json`;

      fetch(geocodingUrl)
        .then(response => response.json())
        .then(data => {
          const latitude = data.results[0].latitude;
          const longitude = data.results[0].longitude;
          if (this.marker) {
            this.map.removeLayer(this.marker);
          }
  
          this.marker = L.marker([latitude, longitude]).addTo(this.map);
  
          this.map.setView([latitude, longitude], 13);
        })
        .catch(error => {
          console.error('Error fetching geocoding data:', error);
        });
    }
  }

}
