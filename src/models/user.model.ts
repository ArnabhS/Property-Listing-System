import mongoose, { Schema } from 'mongoose';
import { IUser } from '../types/index';

const userSchema: Schema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }],
  recommendationsReceived: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }]
}, { timestamps: true });

export default mongoose.model<IUser & Document>('User', userSchema);
