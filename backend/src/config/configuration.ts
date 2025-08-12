import { registerAs } from '@nestjs/config';
import { EnvironmentVariables } from './env.validation';

export const appConfig = registerAs(
  'app',
  (): EnvironmentVariables => ({
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT || '3001', 10),
    MONGODB_URI:
      process.env.MONGODB_URI || 'mongodb://localhost:27017/stock-management',
    FINANCIAL_MODELING_PREP_API_KEY:
      process.env.FINANCIAL_MODELING_PREP_API_KEY,
    CORS_ORIGIN:
      process.env.CORS_ORIGIN || 'http://localhost:3000,http://localhost:5173',
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  }),
);
