import 'text-encoding-polyfill';
import Joi from 'joi';

export const loginSchema = Joi.object({
    email: Joi.string().email({ tlds: { allow: false } }).required().messages({
      'string.empty': 'El correo electrónico es requerido.',
      'string.email': 'El correo electrónico debe ser válido.'
    }),
    password: Joi.string().min(8).max(12).required().messages({
      'string.empty': 'La contraseña es requerida.',
      'string.min': 'La contraseña debe tener al menos 8 caracteres.',
      'string.max': 'La contraseña no puede exceder los 12 caracteres.'
    })
});