import mongoose, { Schema, Document } from 'mongoose';
import { IProperty } from '../types/index.js';

const propertySchema: Schema = new Schema<IProperty>({
    id: { 
        type: String, 
        required: true 
    },
    title: { 
        type: String, 
        required: true 
    },
    type: { 
        type: String, 
        required: true 
    },
    price: { 
        type: Number, 
        required: true 
    },
    state: { 
        type: String, 
        required: true 
    },
    city: { 
        type: String, 
        required: true 
    },
    areaSqFt: { 
        type: Number, 
        required: true 
    },
    bedrooms: { 
        type: Number, 
        required: true 
    },
    bathrooms: { 
        type: Number, 
        required: true 
    },
    amenities: { 
        type: [String], 
        required: true 
    },
    furnished: { 
        type: String, 
        enum: ['Furnished', 'Unfurnished', 'Semi'], 
        required: true 
    },
    availableFrom: { 
        type: String, 
        required: true 
    },
    listedBy: { 
        type: String, 
        enum: ['Builder', 'Owner', 'Agent'], 
        required: true 
    },
    tags: { 
        type: [String], 
        required: true 
    },
    colorTheme: { 
        type: String, 
        required: true 
    },
    rating: { 
        type: Number, 
        required: true 
    },
    isVerified: { 
        type: Boolean, 
        required: true 
    },
    listingType: { 
        type: String, 
        enum: ['sale', 'rent'], 
        required: true 
    },
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    }
}, { timestamps: true });

export default mongoose.model<IProperty & Document>('Property', propertySchema);
