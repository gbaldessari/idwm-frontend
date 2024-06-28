import 'text-encoding-polyfill';
import Joi from 'joi';

export const registerSchema = Joi.object({
  name: Joi.string().min(1).max(20).required().messages({
    'string.empty': 'El nombre es requerido.',
    'string.min': 'El nombre debe tener al menos 1 caracter.',
    'string.max': 'El nombre no puede exceder los 20 caracteres.'
  }),
  lastName: Joi.string().min(1).max(20).required().messages({
    'string.empty': 'El apellido es requerido.',
    'string.min': 'El apellido debe tener al menos 1 caracter.',
    'string.max': 'El apellido no puede exceder los 20 caracteres.'
  }),
  email: Joi.string().min(1).max(256).pattern(/^\S+@\S+\.\S+$/).required().messages({
    'string.empty': 'El correo electrónico es requerido.',
    'string.pattern.base': 'El correo electrónico debe ser válido.'
  }),
  password: Joi.string().min(8).max(12).required().messages({
    'string.empty': 'La contraseña es requerida.',
    'string.min': 'La contraseña debe tener al menos 8 caracteres.',
    'string.max': 'La contraseña no puede exceder los 12 caracteres.'
  }),
  birthdate: Joi.string().pattern(/^\d{2}\/\d{2}\/\d{4}$/).required().custom((value, helpers) => {
    const [day, month, year] = value.split('/');
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    const now = new Date();
    if (date.getFullYear() !== Number(year) || date.getMonth() !== Number(month) - 1 || date.getDate() !== Number(day)) {
      return helpers.error('any.invalid', { custom: 'La fecha de nacimiento no es válida.' });
    }
    if (date > now) {
      return helpers.error('date.future', { custom: 'La fecha de nacimiento no puede ser en el futuro.' });
    }
    if (date.getFullYear() < 1900) {
      return helpers.error('date.past', { custom: 'La fecha de nacimiento no puede ser anterior a 1900.' });
    }
    return value;
  }, 'Fecha de nacimiento').messages({
    'string.pattern.base': 'La fecha de nacimiento debe tener el formato DD/MM/AAAA.',
    'any.required': 'La fecha de nacimiento es requerida.',
    'any.invalid': 'La fecha de nacimiento no es válida.',
    'date.future': 'La fecha de nacimiento no puede ser en el futuro.',
    'date.past': 'La fecha de nacimiento no puede ser anterior a 1900.'
  })
});