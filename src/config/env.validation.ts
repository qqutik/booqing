import Joi from 'joi';

export const envValidationSchema = Joi.object({
  PORT: Joi.number().default(3000),

  APP_ENV: Joi.string().required().valid('dev', 'prod', 'test'),
  APP_URL: Joi.string().required().uri(),

  DB_PORT: Joi.number().default(5432),
  DB_HOST: Joi.string().required(),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),

  JWT_SECRET: Joi.string().min(32).required(),
  JWT_EXPIRES_IN: Joi.number().default(3600),

  BOOKING_CANCEL_MIN_HOURS: Joi.number().integer().min(0).default(6),
  BOOKING_MAX_ACTIVE_PER_USER: Joi.number().integer().min(1).default(10),
  BOOKING_REMINDER_HOURS: Joi.number().integer().min(1).default(24),
  BOOKING_HOLD_MINUTES: Joi.number().integer().min(1).default(35),

  REDIS_HOST: Joi.string().default('localhost'),
  REDIS_PORT: Joi.number().default(6379),

  MAIL_HOST: Joi.string().default('localhost'),
  MAIL_PORT: Joi.number().default(1025),
  MAIL_FROM: Joi.string().email().default('no-reply@booqing.local'),

  PAYMENT_SESSION_MINUTES: Joi.number().integer().min(30).default(30),

  STRIPE_SECRET_KEY: Joi.string().pattern(/^sk_test_/).required(),
  STRIPE_WEBHOOK_SECRET: Joi.string().required(),
  STRIPE_SUCCESS_URL: Joi.string().required().uri(),
  STRIPE_CANCEL_URL: Joi.string().required().uri(),
});
