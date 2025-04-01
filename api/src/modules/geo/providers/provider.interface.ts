export interface GeoPosition {
  lat: string;
  lng: string;
}
export interface GeoAddress {
  formatted: string;
  geometry: GeoPosition;
  id: string;
}
export interface GeoProvider {
  searchQuery(query: string, center: number[]): Promise<GeoAddress[]>;
  getAddress(position: GeoPosition): Promise<GeoAddress>;
}
