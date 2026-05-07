export interface Property {
  id: string;
  title: string;
  description: string | null;
  city: string;
  country: string;
  price_per_night: number;
  image_url: string | null;
  guests: number;
  bedrooms: number;
  bathrooms: number;
  category: string;
  rating: number;
  host_id?: string;
  created_at?: string; 
  profiles?: {
    full_name: string | null;
  };
}

export interface CreatePropertyDto {
  title: string;
  description: string;
  city: string;
  country: string;
  price_per_night: number;
  image_url: string;
  guests: number;
  bedrooms: number; 
  bathrooms: number;
  category: string;
  rating: number;
}