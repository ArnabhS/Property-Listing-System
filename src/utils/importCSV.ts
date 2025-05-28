
import fs from 'fs';
import csv from 'csv-parser';
import Property from '../models/property.model';


export const importCSV = async (filePath: string, userId: string): Promise<string> => {
  const properties: any[] = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
       
        try {
          properties.push({
            ...row,
            amenities: row.amenities?.split('|') || [],
            tags: row.tags?.split('|') || [],
            rating: parseFloat(row.rating),
            isVerified: row.isVerified === 'TRUE',
            price: parseInt(row.price),
            bedrooms: parseInt(row.bedrooms),
            bathrooms: parseInt(row.bathrooms),
            areaSqFt: parseInt(row.areaSqFt),
            furnished: row.furnished ,
            createdBy: userId, 
          });
        } catch (err) {
          console.error('Skipping row due to error:', err);
        }
      })
      .on('end', async () => {
        await Property.insertMany(properties);
        resolve('CSV Imported Successfully');
      })
      .on('error', reject);
  });
};
