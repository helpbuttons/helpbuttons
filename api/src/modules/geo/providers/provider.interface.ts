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
  searchQuery(query: string, lat: string, lng: string): Promise<GeoAddress[]>;
  getAddress(position: GeoPosition): Promise<GeoAddress>;
}
