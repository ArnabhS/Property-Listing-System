import jwt from 'jsonwebtoken';

export const generateToken = (userId: string, email: string) => {
  const jwtSecret = process.env.JWT_SECRET as string;
  if (!jwtSecret) {
    throw new Error("JWT_SECRET environment variable is not defined");
  }
  return jwt.sign({ userId, email }, jwtSecret, {
    expiresIn: "7d", 
  });
};