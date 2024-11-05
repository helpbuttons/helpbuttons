import { HttpException, HttpStatus } from '@nestjs/common';

// import { HttpClient } from '@nestjs/common';
export interface GeoPosition {
  lat: string;
  lng: string;
}
export interface GeoAddress {
  formatted: string;
  formatted_city: string;
  geometry: GeoPosition;
  id: string;
}
export interface GeoProvider {
  searchQuery(query: string): Promise<GeoAddress[]>;
  getAddress(position: GeoPosition): Promise<GeoAddress>;
}
