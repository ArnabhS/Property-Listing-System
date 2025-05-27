import { Request, Response } from 'express';
import Property from '../models/property.model'
import User from '../models/user.model'
import { asyncHandler } from '../utils/asyncHandler';

export const createProperty = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get the last property to determine the next ID
    const lastProperty = await Property.findOne().sort({ id: -1 });
    let nextId = 'PROP1000'; // Default starting ID

    if (lastProperty) {
      // Extract the number from the last ID and increment it
      const lastNumber = parseInt(lastProperty.id.replace('PROP', ''));
      nextId = `PROP${lastNumber + 1}`;
    }

    const requiredFields = [
      'title', 'type', 'price', 'state', 'city', 'areaSqFt',
      'bedrooms', 'bathrooms', 'amenities', 'furnished',
      'availableFrom', 'listedBy', 'tags', 'colorTheme',
      'listingType'
    ];

    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ message: `Missing required field: ${field}` });
      }
    }

    // String validations
    if (typeof req.body.title !== 'string' || req.body.title.trim().length < 3) {
      return res.status(400).json({ message: 'Title must be at least 3 characters long' });
    }

    if (typeof req.body.state !== 'string' || req.body.state.trim().length < 2) {
      return res.status(400).json({ message: 'State must be at least 2 characters long' });
    }

    if (typeof req.body.city !== 'string' || req.body.city.trim().length < 2) {
      return res.status(400).json({ message: 'City must be at least 2 characters long' });
    }

    // Number validations
    if (typeof req.body.price !== 'number' || req.body.price <= 0) {
      return res.status(400).json({ message: 'Price must be a positive number' });
    }

    if (typeof req.body.areaSqFt !== 'number' || req.body.areaSqFt <= 0) {
      return res.status(400).json({ message: 'Area must be a positive number' });
    }

    if (!Number.isInteger(req.body.bedrooms) || req.body.bedrooms < 0) {
      return res.status(400).json({ message: 'Bedrooms must be a positive number' });
    }

    if (!Number.isInteger(req.body.bathrooms) || req.body.bathrooms < 0) {
      return res.status(400).json({ message: 'Bathrooms must be a positive number' });
    }

    // Enum validations
    const validFurnishedTypes = ['Furnished', 'Unfurnished', 'Semi'];
    if (!validFurnishedTypes.includes(req.body.furnished)) {
      return res.status(400).json({ 
        message: `Furnished must be one of: ${validFurnishedTypes.join(', ')}` 
      });
    }

    const validListedByTypes = ['Builder', 'Owner', 'Agent'];
    if (!validListedByTypes.includes(req.body.listedBy)) {
      return res.status(400).json({ 
        message: `ListedBy must be one of: ${validListedByTypes.join(', ')}` 
      });
    }

    const validListingTypes = ['sale', 'rent'];
    if (!validListingTypes.includes(req.body.listingType)) {
      return res.status(400).json({ 
        message: `ListingType must be one of: ${validListingTypes.join(', ')}` 
      });
    }

   
    if (!Array.isArray(req.body.amenities) || req.body.amenities.length === 0) {
      return res.status(400).json({ message: 'At least one amenity must be provided' });
    }

    if (!Array.isArray(req.body.tags) || req.body.tags.length === 0) {
      return res.status(400).json({ message: 'At least one tag must be provided' });
    }

    
    const availableFromDate = new Date(req.body.availableFrom);
    if (isNaN(availableFromDate.getTime())) {
      return res.status(400).json({ message: 'Invalid availableFrom date format' });
    }

    
    const property = new Property({
      ...req.body,
      createdBy: userId,
      rating: req.body.rating || 0,
      isVerified: req.body.isVerified || false,
      id: nextId
    });

    await property.save();
    res.status(201).json({
      success: true,
      message: 'Property created successfully',
      data: property
    });
  } catch (error) {
    res.status(501).json({
      success: false,
      message: 'Internal server error'
    });
  }
});


export const updateProperty = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    // Check if property exists
    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Authorization check
    if (property.createdBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this property'
      });
    }

    // Validate fields if they are being updated
    const updateData = req.body;

    // String validations
    if (updateData.title && (typeof updateData.title !== 'string' || updateData.title.trim().length < 3)) {
      return res.status(400).json({
        success: false,
        message: 'Title must be at least 3 characters long'
      });
    }

    if (updateData.state && (typeof updateData.state !== 'string' || updateData.state.trim().length < 2)) {
      return res.status(400).json({
        success: false,
        message: 'State must be at least 2 characters long'
      });
    }

    if (updateData.city && (typeof updateData.city !== 'string' || updateData.city.trim().length < 2)) {
      return res.status(400).json({
        success: false,
        message: 'City must be at least 2 characters long'
      });
    }

    // Number validations
    if (updateData.price && (typeof updateData.price !== 'number' || updateData.price <= 0)) {
      return res.status(400).json({
        success: false,
        message: 'Price must be a positive number'
      });
    }

    if (updateData.areaSqFt && (typeof updateData.areaSqFt !== 'number' || updateData.areaSqFt <= 0)) {
      return res.status(400).json({
        success: false,
        message: 'Area must be a positive number'
      });
    }

    if (updateData.bedrooms && (!Number.isInteger(updateData.bedrooms) || updateData.bedrooms < 0)) {
      return res.status(400).json({
        success: false,
        message: 'Bedrooms must be a positive number'
      });
    }

    if (updateData.bathrooms && (!Number.isInteger(updateData.bathrooms) || updateData.bathrooms < 0)) {
      return res.status(400).json({
        success: false,
        message: 'Bathrooms must be a positive number'
      });
    }

    // Enum validations
    const validFurnishedTypes = ['Furnished', 'Unfurnished', 'Semi'];
    if (updateData.furnished && !validFurnishedTypes.includes(updateData.furnished)) {
      return res.status(400).json({
        success: false,
        message: `Furnished must be one of: ${validFurnishedTypes.join(', ')}`
      });
    }

    const validListedByTypes = ['Builder', 'Owner', 'Agent'];
    if (updateData.listedBy && !validListedByTypes.includes(updateData.listedBy)) {
      return res.status(400).json({
        success: false,
        message: `ListedBy must be one of: ${validListedByTypes.join(', ')}`
      });
    }

    const validListingTypes = ['sale', 'rent'];
    if (updateData.listingType && !validListingTypes.includes(updateData.listingType)) {
      return res.status(400).json({
        success: false,
        message: `ListingType must be one of: ${validListingTypes.join(', ')}`
      });
    }

    // Array validations
    if (updateData.amenities && (!Array.isArray(updateData.amenities) || updateData.amenities.length === 0)) {
      return res.status(400).json({
        success: false,
        message: 'At least one amenity must be provided'
      });
    }

    if (updateData.tags && (!Array.isArray(updateData.tags) || updateData.tags.length === 0)) {
      return res.status(400).json({
        success: false,
        message: 'At least one tag must be provided'
      });
    }

    // Date validation
    if (updateData.availableFrom) {
      const availableFromDate = new Date(updateData.availableFrom);
      if (isNaN(availableFromDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: 'Invalid availableFrom date format'
        });
      }
    }

    // Prevent updating certain fields
    const fieldsToExclude = ['id', 'createdBy', 'createdAt'];
    fieldsToExclude.forEach(field => {
      delete updateData[field];
    });

    // Update the property
    const updatedProperty = await Property.findByIdAndUpdate(
      id,
      { $set: updateData },
      { 
        new: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: 'Property updated successfully',
      data: updatedProperty
    });
  } catch (error) {
    return res.status(501).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export const deleteProperty = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    
    if(!userId || !id){
      return res.status(400).json({
        success: false,
        message: 'UserId and id are required'
      });
    }
    const property = await Property.findById(id);
    if (!property || property.createdBy.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await Property.findByIdAndDelete(id);
    return res.status(204).json({
      success: true, 
      message: 'Property deleted successfully'
    });
  } catch (error) {
    return res.status(501).json({
      success: false,
      message: 'Internal server error'
    });
  }
});



export const searchProperties = asyncHandler(async (req: Request, res: Response) => {
  try {
    const {
      title,
      type,
      minPrice,
      maxPrice,
      state,
      city,
      minArea,
      maxArea,
      bedrooms,
      bathrooms,
      furnished,
      listedBy,
      listingType,
      amenities,
      tags,
      availableFrom,
      isVerified,
    } = req.query;

    
    const filter: any = {};

   
    if (title) filter.title = title;
    if (type) filter.type = type;
    if (state) filter.state = state;
    if (city) filter.city = city;
    if (furnished) filter.furnished = furnished;
    if (listedBy) filter.listedBy = listedBy;
    if (listingType) filter.listingType = listingType;
    if (isVerified !== undefined) filter.isVerified = isVerified === 'true';

    // Range queries
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (minArea || maxArea) {
      filter.areaSqFt = {};
      if (minArea) filter.areaSqFt.$gte = Number(minArea);
      if (maxArea) filter.areaSqFt.$lte = Number(maxArea);
    }

    // Exact number matches
    if (bedrooms) filter.bedrooms = Number(bedrooms);
    if (bathrooms) filter.bathrooms = Number(bathrooms);

    // Array contains
    if (amenities) {
      const amenitiesArray = Array.isArray(amenities) ? amenities : [amenities];
      filter.amenities = { $in: amenitiesArray };
    }

    if (tags) {
      const tagsArray = Array.isArray(tags) ? tags : [tags];
      filter.tags = { $in: tagsArray };
    }

    // Date
    if (availableFrom) {
      filter.availableFrom = new Date(availableFrom as string);
    }

    const properties = await Property.find(filter)

    return res.status(200).json({
      success: true,
      message: 'Properties retrieved successfully',
      data: properties
    });
  } catch (error) {
    return res.status(501).json({
      success: false,
      message: 'Internal server error'
    });
  }
});




