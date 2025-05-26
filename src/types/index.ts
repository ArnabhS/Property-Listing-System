import mongoose from "mongoose";

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  favorites?: string[];
  recommendationsReceived?: string[];
}


export interface IProperty {
  _id?: string;
  id: string;
  title: string;
  type: string;
  price: number;
  state: string;
  city: string;
  areaSqFt: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  furnished: 'Furnished' | 'Unfurnished' | 'Semi';
  availableFrom: string;
  listedBy: 'Builder' | 'Owner' | 'Agent';
  tags: string[];
  colorTheme: string;
  rating: number;
  isVerified: boolean;
  listingType: 'sale' | 'rent';
  createdBy: mongoose.Schema.Types.ObjectId; 
}