import { Component, OnInit, signal } from '@angular/core';
import { Supabase } from '../../core/services/supabase';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Property } from '../../core/models/property.model';

@Component({
  selector: 'app-home',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  properties = signal<Property[]>([]);
  isLoading = signal(true);
  isSearching = signal(false);

  searchCity = '';

  constructor(private supabaseService: Supabase) {}

  async ngOnInit() {
    await this.loadProperties(); 
  }

  async loadProperties() {
    this.isLoading.set(true);

    const { data, error } = await this.supabaseService.getProperties();

    if (!error && data) {
      this.properties.set(data as Property[]);
    }

    this.isLoading.set(false);

  }

  async searchByCity() {
    this.isSearching.set(true);

    const { data, error } =
      await this.supabaseService.getAvailablePropertiesByCity(this.searchCity);

    if (!error && data) {
      this.properties.set(data as Property[]);
    }

    this.isSearching.set(false);
  }

  async clearSearch() {
    this.searchCity = '';
    await this.loadProperties();
  }
  
}
