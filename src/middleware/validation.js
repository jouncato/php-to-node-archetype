const Joi = require('joi');

const validationMiddleware = {
  // Validar datos de inicio de sesión
  validateLogin: (req, res, next) => {
    const schema = Joi.object({
      email: Joi.string().email().required().messages({
        'string.email': 'El email debe tener un formato válido',
        'any.required': 'El email es obligatorio'
      }),
      password: Joi.string().min(6).required().messages({
        'string.min': 'La contraseña debe tener al menos 6 caracteres',
        'any.required': 'La contraseña es obligatoria'
      })
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }
    next();
  },

  // Validar datos de actualización de usuario
  validateUserUpdate: (req, res, next) => {
    const schema = Joi.object({
      nombre: Joi.string().min(2).required().messages({
        'string.min': 'El nombre debe tener al menos 2 caracteres',
        'any.required': 'El nombre es obligatorio'
      }),
      email: Joi.string().email().required().messages({
        'string.email': 'El email debe tener un formato válido',
        'any.required': 'El email es obligatorio'
      })
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }
    next();
  }
};

module.exports = validationMiddleware;