import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environment/environment';
import { CreatePropertyDto, Property } from '../models/property.model';
import { CreateBookingDto } from '../models/booking.model';

@Injectable({
  providedIn: 'root',
})
export class Supabase {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  get client() {
    return this.supabase;
  }

  async getCurrentUser() {
    const { data } = await this.supabase.auth.getUser();
    return data.user;
  }

  async getProperties() {
    return this.supabase
      .from('properties')
      .select('*, profiles(full_name)')
      .order('created_at', { ascending: false });
  }

  async getPropertyById(id: string) {
    return this.supabase
    .from('properties')
    .select('*, profiles(full_name)')
    .eq('id', id)
    .single<Property>();
  }

  async getAvailablePropertiesByCity(city: string) {
    let query = this.supabase
      .from('properties')
      .select('*, profiles(full_name)')
      .order('created_at', { ascending: false });

    if (city.trim()) {
      query = query.ilike('city', `%${city}%`);
    }

    return query;
  }

  async createProperty(property: CreatePropertyDto) {
    const user = await this.getCurrentUser();

    return this.supabase.from('properties').insert({
      ...property,
      host_id: user?.id,
    });
  }

  async getBookings() {
    return this.supabase
      .from('bookings')
      .select('*, properties(title, city, country, image_url)')
      .order('created_at', { ascending: false });
  }

  async createBooking(booking: CreateBookingDto) {
    const user = await this.getCurrentUser();

    return this.supabase.from('bookings').insert({
      ...booking,
      client_id: user?.id || null,
    });
  } 

  async uploadPropertyImage(file: File) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${crypto.randomUUID()}.${fileExt}`;
    const filePath = `properties/${fileName}`;

    const { error } = await this.supabase.storage
      .from('property-images')
      .upload(filePath, file);

    if (error) {
      return { imageUrl: null, error };
    }

    const { data } = this.supabase.storage
      .from('property-images')
      .getPublicUrl(filePath);

    return {
      imageUrl: data.publicUrl,
      error: null,
    };
  }

  async getAvailability(propertyId: string) {
    return this.supabase
      .from('property_availability')
      .select('*')
      .eq('property_id', propertyId);
  }

  async blockDates(propertyId: string, checkIn: string, checkOut: string) {
    const dates = [];
    const start = new Date(checkIn);
    const end = new Date(checkOut);

    for (
      let date = new Date(start);
      date < end;
      date.setDate(date.getDate() + 1)
    ) {
      dates.push({
        property_id: propertyId,
        date: date.toISOString().split('T')[0],
        is_available: false,
      });
    }

    return this.supabase
      .from('property_availability')
      .upsert(dates, {
        onConflict: 'property_id,date',
      });
  }
  
}
