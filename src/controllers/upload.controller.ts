import { NextFunction, Response } from 'express';
import { importCSV } from '../utils/importCSV';
import { AuthRequest } from '../middlewares/auth.middleware';

export const importProperties = async (req: AuthRequest, res: Response, next: NextFunction) : Promise<void> => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }
    if (!req.file){
      res.status(400).json({ message: 'CSV file required' });
      return;
    } 

    const message = await importCSV(req.file.path, userId);
    res.status(200).json({ message });
    return;
  } catch (error) {
    console.error('CSV Import Error:', error);
    res.status(500).json({ message: 'Failed to import CSV' });
    next(error);
    return;
  }
};

