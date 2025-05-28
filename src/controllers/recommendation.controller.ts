import { NextFunction, Request, Response } from 'express';
import User from '../models/user.model';
import Property from '../models/property.model';
import { AuthRequest } from '../middlewares/auth.middleware';


export const recommendProperty = async (req: Request, res: Response,next:NextFunction) : Promise<void> => {
  try {
    const { senderId, propertyId, recipientEmail } = req.body;

    // Validate required fields
    if (!senderId || !propertyId || !recipientEmail) {
      res.status(400).json({
        success: false,
        message: 'Sender ID, property ID, and recipient email are required'
      });
      return;
    }

    // Check if sender exists
    const sender = await User.findById(senderId);
    if (!sender) {
      res.status(404).json({
        success: false,
        message: 'Sender not found'
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

    // Find recipient by email
    const recipient = await User.findOne({ email: recipientEmail });
    if (!recipient) {
      res.status(404).json({
        success: false,
        message: 'Recipient not found'
      });
      return;
    }

    // Check if property is already recommended to this user
    if (recipient.recommendationsReceived?.includes(propertyId)) {
      res.status(400).json({
        success: false,
        message: 'Property already recommended to this user'
      });
      return;
    }

    // Add property to recipient's recommendations
    recipient.recommendationsReceived = [
      ...(recipient.recommendationsReceived || []),
      propertyId
    ];
    await recipient.save();

    res.status(200).json({
      success: true,
      message: 'Property recommended successfully',
      data: {
        recipient: recipient.email,
        property: property.title
      }
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

export const getRecommendations =async (req: AuthRequest, res: Response,next:NextFunction) : Promise<void> => {
  try {
   
    const { userId } = req.params;
    
    if (!userId) {
      res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
      return;
    }

    // Find user and populate recommendations
    const user = await User.findById(userId)
      .populate({
        path: 'recommendationsReceived',
        populate: {
          path: 'createdBy',
          select: 'email'
        }
      });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Recommendations retrieved successfully',
      data: user.recommendationsReceived
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

export const removeRecommendation = async (req: AuthRequest, res: Response,next:NextFunction) : Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }
    const { _id: userId } = req.user;
    const { propertyId } = req.body;

    if (!userId || !propertyId) {
      res.status(400).json({
        success: false,
        message: 'User ID and property ID are required'
      });
      return;
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    // Check if property is in recommendations
    if (!user.recommendationsReceived?.includes(propertyId)) {
      res.status(400).json({
        success: false,
        message: 'Property is not in recommendations'
      });
      return;
    }

    // Remove property from recommendations
    user.recommendationsReceived = user.recommendationsReceived.filter(
      id => id.toString() !== propertyId
    );
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Recommendation removed successfully',
      data: user.recommendationsReceived
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
