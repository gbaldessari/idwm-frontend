import 'text-encoding-polyfill';
import Joi from 'joi';

export const updatePasswordSchema = Joi.object({
  oldPassword: Joi.string().min(8).max(12).required().messages({
    'string.empty': 'La contraseña actual es obligatoria',
    'string.min': 'La contraseña debe tener al menos 8 caracteres',
    'string.max': 'La contraseña no debe tener más de 12 caracteres',
  }),
  newPassword: Joi.string().min(8).max(12).required().messages({
    'string.empty': 'La nueva contraseña es obligatoria',
    'string.min': 'La nueva contraseña debe tener al menos 8 caracteres',
    'string.max': 'La nueva contraseña no debe tener más de 12 caracteres',
  })
});