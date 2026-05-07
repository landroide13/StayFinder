import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Supabase } from '../../core/services/supabase';
import { CreateBookingDto } from '../../core/models/booking.model';
import { Property } from '../../core/models/property.model';

interface CalendarDay {
  date: string;
  label: string;
  day: number;
  is_available: boolean;
}

@Component({
  selector: 'app-property-detail',
  imports: [CommonModule, FormsModule],
  templateUrl: './property-detail.html',
  styleUrl: './property-detail.scss',
})
export class PropertyDetail {
  property = signal<Property | null>(null);
  calendarDays = signal<CalendarDay[]>([]);

  isLoading = signal(true);
  isBooking = signal(false);

  errorMessage = signal('');
  successMessage = signal('');

  booking = {
    guest_name: '',
    guest_email: '',
    check_in: '',
    check_out: '',
  };

  constructor(
    private route: ActivatedRoute,
    private supabaseService: Supabase
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.errorMessage.set('Property ID was not found.');
      this.isLoading.set(false);
      return;
    }

    const { data, error } = await this.supabaseService.getPropertyById(id);

    if (error) {
      console.error(error);
      this.errorMessage.set(error.message);
      this.isLoading.set(false);
      return;
    }

    this.property.set(data as Property);
    await this.loadAvailability(id);

    this.isLoading.set(false);
  }

  isSelectedRangeAvailable() {
    if (!this.booking.check_in || !this.booking.check_out) return false;

    const start = new Date(this.booking.check_in);
    const end = new Date(this.booking.check_out);

    if (end <= start) return false;

    return this.calendarDays().every((day) => {
      const current = new Date(day.date);

      if (current >= start && current < end) {
        return day.is_available;
      }

      return true;
    });
  }

  async submitBooking() {
    const currentProperty = this.property();

    if (!currentProperty) return;

    this.errorMessage.set('');
    this.successMessage.set('');
    this.isBooking.set(true);

    if (!this.isSelectedRangeAvailable()) {
      this.errorMessage.set('These dates are not available.');
      this.isBooking.set(false);
      return;
    }

    const nights = this.calculateNights();

    const payload: CreateBookingDto = {
      property_id: currentProperty.id,
      guest_name: this.booking.guest_name,
      guest_email: this.booking.guest_email,
      check_in: this.booking.check_in,
      check_out: this.booking.check_out,
      status: 'pending',
      total_price: nights * currentProperty.price_per_night,
    };

    const { error } = await this.supabaseService.createBooking(payload);

    if (error) {
      this.errorMessage.set(error.message);
      this.isBooking.set(false);
      return;
    }

    await this.supabaseService.blockDates(
      currentProperty.id,
      this.booking.check_in,
      this.booking.check_out
    );

    await this.loadAvailability(currentProperty.id);

    this.successMessage.set('Booking request sent successfully!');

    this.booking = {
      guest_name: '',
      guest_email: '',
      check_in: '',
      check_out: '',
    };

    this.isBooking.set(false);
  }

  async loadAvailability(propertyId: string) {
    const { data } = await this.supabaseService.getAvailability(propertyId);

    const unavailableDates =
      data
        ?.filter((item: any) => !item.is_available)
        .map((item: any) => item.date) || [];

    const days = Array.from({ length: 30 }).map((_, index) => {
      const date = new Date();
      date.setDate(date.getDate() + index);

      const iso = date.toISOString().split('T')[0];

      return {
        date: iso,
        label: date.toLocaleDateString('en-US', { weekday: 'short' }),
        day: date.getDate(),
        is_available: !unavailableDates.includes(iso),
      };
    });

    this.calendarDays.set(days);
  }

  selectDate(date: string) {
    if (!this.booking.check_in) {
      this.booking.check_in = date;
      return;
    }

    this.booking.check_out = date;
  }

  calculateNights() {
    const checkIn = new Date(this.booking.check_in);
    const checkOut = new Date(this.booking.check_out);

    const diff = checkOut.getTime() - checkIn.getTime();

    return Math.max(1, diff / (1000 * 60 * 60 * 24));
  }

}
