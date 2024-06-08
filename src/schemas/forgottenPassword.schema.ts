import 'text-encoding-polyfill';
import Joi from 'joi';

export const forgotenPasswordSchema = Joi.object({
    email: Joi.string().email({ tlds: { allow: false } }).required()
});