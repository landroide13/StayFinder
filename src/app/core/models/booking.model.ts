import { Property } from './property.model';

export interface Booking {
  id: string;
  property_id: string;
  client_id?: string | null;
  guest_name: string;
  guest_email: string;
  check_in: string;
  check_out: string;
  status: 'pending' | 'approved' | 'rejected';
  total_price: number;
  created_at?: string;

  properties?: Pick<Property, 'title' | 'city' | 'country' | 'image_url'>;
}

export interface CreateBookingDto {
  property_id: string;
  guest_name: string;
  guest_email: string;
  check_in: string;
  check_out: string;
  status: 'pending';
  total_price: number;
}


