import { NextFunction, Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware.js";
import Property from '../models/property.model.js'
import User from '../models/user.model.js'

export const addToFavorites = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Not authorized' });
        return;
      }
      // get user id from middleware
      const { _id: userId } = req.user;
      const { propertyId } = req.body;

      // check if all fields are filled
      if (!userId || !propertyId) {
        res.status(400).json({
          success: false,
          message: 'Both userId and propertyId are required'
        });
        return;
      }
  
      // Check if property exists
      const property = await Property.findById(propertyId);
      if (!property) {
        res.status(404).json({
          success: false,
          message: 'Property not found'
        });
        return;
      }
  
      // Check if user exists
      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }
  
      // Check if property is already in favorites
      if (user.favorites?.includes(propertyId)) {
        res.status(400).json({
          success: false,
          message: 'Property is already in favorites'
        });
        return;
      }
  
      // Add property to favorites
      user.favorites = [...(user.favorites || []), propertyId];
      await user.save();
  
      res.status(200).json({
        success: true,
        message: 'Property added to favorites successfully',
        data: user.favorites
      });
    } catch (error) {
      res.status(501).json({
        success: false,
        message: 'Internal server error'
      });
      next(error);
      return;
    }
  };
  
  export const removeFromFavorites = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Not authorized' });
        return;
      }
      // get user id from middleware
      const { _id: userId } = req.user;
      const { propertyId } = req.body;

      // check if all fields are filled
      if (!userId || !propertyId) {
        res.status(400).json({
          success: false,
          message: 'Both userId and propertyId are required'
        });
        return;
      }
  
      // Check if user exists
      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }
  
      // Check if property is in favorites
      if (!user.favorites?.includes(propertyId)) {
        res.status(400).json({
          success: false,
          message: 'Property is not in favorites'
        });
        return;
      }
  
      // Remove property from favorites
      user.favorites = user.favorites.filter((id: string) => id.toString() !== propertyId);
      await user.save();
  
      res.status(200).json({
        success: true,
        message: 'Property removed from favorites successfully',
        data: user.favorites
      });
      return;
    } catch (error) {
      res.status(501).json({
        success: false,
        message: 'Internal server error'
      });
      next(error);
      return;
    }
  }
  
  export const getFavorites = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Not authorized' });
        return;
      }
      // get user id from middleware
      const { _id: userId } = req.user;

      // check if all fields are filled
      if (!userId) {
        res.status(400).json({
          success: false,
          message: 'UserId is required'
        });
        return;
      }
  
      // Check if user exists and populate favorites
      const user = await User.findById(userId).populate('favorites');
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }
  
      res.status(200).json({
        success: true,
        message: 'Favorites retrieved successfully',
        data: user.favorites
      });
      return;
    } catch (error) {
      res.status(501).json({
        success: false,
        message: 'Internal server error'
      });
      next(error);
      return;
    }
  }