import 'text-encoding-polyfill';
import Joi from 'joi';

export const updateProfileSchema = Joi.object({
	name: Joi.string().min(1).max(20).required(),
	lastName: Joi.string().min(1).max(20).required(),
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