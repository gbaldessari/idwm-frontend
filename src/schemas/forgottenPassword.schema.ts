import 'text-encoding-polyfill';
import Joi from 'joi';

export const forgotenPasswordSchema = Joi.object({
	email: Joi.string().email({ tlds: { allow: false } }).required().messages({
		'string.empty': 'El correo electrónico es requerido.',
		'string.email': 'El correo electrónico debe ser válido.'
	})
});