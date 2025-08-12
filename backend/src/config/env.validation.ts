import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3001),

  MONGODB_URI: Joi.string().required(),

  FINANCIAL_MODELING_PREP_API_KEY: Joi.string().required(),

  CORS_ORIGIN: Joi.string().default(
    'http://localhost:3000,http://localhost:5173',
  ),

  JWT_SECRET: Joi.string().optional(),
  JWT_EXPIRES_IN: Joi.string().default('24h'),

  LOG_LEVEL: Joi.string()
    .valid('error', 'warn', 'info', 'debug')
    .default('info'),
});

export interface EnvironmentVariables {
  NODE_ENV: string;
  PORT: number;
  MONGODB_URI: string;
  FINANCIAL_MODELING_PREP_API_KEY: string;
  CORS_ORIGIN: string;
  JWT_SECRET?: string;
  JWT_EXPIRES_IN: string;
  LOG_LEVEL: string;
}
