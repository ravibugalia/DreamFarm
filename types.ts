
export enum TreeHealth {
  EXCELLENT = 'Excellent',
  GOOD = 'Good',
  FAIR = 'Fair',
  POOR = 'Poor',
  CRITICAL = 'Critical'
}

export enum FruitProduction {
  NONE = 'None',
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  ABUNDANT = 'Abundant'
}

export interface GeoLocation {
  lat: number;
  lng: number;
}

export interface TreeRecord {
  id: string;
  treeNumber: string;
  treeName: string;
  species: string;
  health: TreeHealth;
  healthDescription?: string;
  production: FruitProduction;
  productionQuantity?: number;
  photo?: string; // base64
  location?: GeoLocation;
  timestamp: number;
  notes?: string;
}

export interface SearchFilters {
  query: string;
}
