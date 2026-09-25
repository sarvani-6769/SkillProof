import jwt from 'jsonwebtoken';

export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'skillproof_secret_fallback', {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  });
};
