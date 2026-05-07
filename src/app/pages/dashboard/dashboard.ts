import { Component, signal } from '@angular/core';
import { Supabase } from '../../core/services/supabase';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Property } from '../../core/models/property.model';
import { Booking } from '../../core/models/booking.model';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  properties = signal<Property[]>([]);
  isLoading = signal(true);

  bookings = signal<Booking[]>([]);
  selectedImageFile: File | null = null;
  imagePreview: string | null = null;
  isUploading = false;

  property = {
    title: '',
    description: '',
    city: '',
    country: '',
    price_per_night: 0,
    image_url: '',
    guests: 1,
    bedrooms: 1,
    bathrooms: 1,
    category: 'apartment',
    rating: 4.8,
  };

  constructor(private supabaseService: Supabase) {}

  async ngOnInit() {
    await this.loadData();
  }

  async loadData() {
    const propertiesResult = await this.supabaseService.getProperties();
    const bookingsResult = await this.supabaseService.getBookings();

    this.properties.set(propertiesResult.data || []);
    this.bookings.set(bookingsResult.data || []);
  }

  // async addProperty() {
  //   const { error } = await this.supabaseService.createProperty(this.property);

  //   if (!error) {
  //     this.property = {
  //       title: '',
  //       description: '',
  //       city: '',
  //       country: '',
  //       price_per_night: 0,
  //       image_url: '',
  //       guests: 1,
  //       bedrooms: 1,
  //       bathrooms: 1,
  //       category: 'apartment',
  //       rating: 4.8,
  //     };

  //     await this.loadData();
  //   }
  // }

  getRevenuePotential() {
    return this.bookings().reduce((total, booking) => {
      return total + Number(booking.total_price || 0);
    }, 0);
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) return;

    this.selectedImageFile = input.files[0];
    this.imagePreview = URL.createObjectURL(this.selectedImageFile);
  }

  async addProperty() {
    this.isUploading = true;
 
    let imageUrl = this.property.image_url;

    if (this.selectedImageFile) {
      const uploadResult = await this.supabaseService.uploadPropertyImage(
        this.selectedImageFile
      );

      if (uploadResult.error) {
        console.error(uploadResult.error);
        this.isUploading = false;
        return;
      }

      imageUrl = uploadResult.imageUrl || '';
    }

    const { error } = await this.supabaseService.createProperty({
      ...this.property,
      image_url: imageUrl,
    });

    if (!error) {
      this.property = {
        title: '',
        description: '',
        city: '',
        country: '',
        price_per_night: 0,
        image_url: '',
        guests: 1,
        bedrooms: 1,
        bathrooms: 1,
        category: 'apartment',
        rating: 4.8,
      };

      this.selectedImageFile = null;
      this.imagePreview = null;

      await this.loadData();
    }

    this.isUploading = false;
  }
}
