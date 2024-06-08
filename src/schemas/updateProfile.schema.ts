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
            return helpers.error('any.invalid');
        }
        if (date > now) {
            return helpers.error('Fecha de nacimiento no puede ser en el futuro');
        }
        return value;
    }, 'Fecha de nacimiento')
});