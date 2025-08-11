const Joi = require('joi');


const validationMiddleware = {
  // Validar y sanear datos de inicio de sesión
  validateLogin: (req, res, next) => {
    // Definir el esquema de validación con sanitización
    const schema = Joi.object({
      email: Joi.string().email().lowercase().trim().required().messages({
        'string.email': 'El email debe tener un formato válido',
        'any.required': 'El email es obligatorio'
      }),
      password: Joi.string().min(8).required().messages({ // Aumentar mínimo a 8
        'string.min': 'La contraseña debe tener al menos 8 caracteres',
        'any.required': 'La contraseña es obligatoria'
      })
    });

    const { error, value } = schema.validate(req.body, { stripUnknown: true }); // stripUnknown elimina campos no definidos en el esquema
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }
    
    // Reemplazar el body original con el saneado
    req.body = value;
    next();
  },

  // Validar y sanear datos de creación de usuario
  validateUserCreate: (req, res, next) => {
    const schema = Joi.object({
      nombre: Joi.string().min(2).max(100).trim().required().messages({
        'string.min': 'El nombre debe tener al menos 2 caracteres',
        'string.max': 'El nombre no puede exceder 100 caracteres',
        'any.required': 'El nombre es obligatorio'
      }),
      email: Joi.string().email().lowercase().trim().required().messages({
        'string.email': 'El email debe tener un formato válido',
        'any.required': 'El email es obligatorio'
      }),
      password: Joi.string().min(8).max(128).required().messages({
        'string.min': 'La contraseña debe tener al menos 8 caracteres',
        'string.max': 'La contraseña no puede exceder 128 caracteres',
        'any.required': 'La contraseña es obligatoria'
      })
    });

    const { error, value } = schema.validate(req.body, { stripUnknown: true });
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }
    
    req.body = value;
    next();
  },

  // Validar y sanear datos de actualización de usuario
  validateUserUpdate: (req, res, next) => {
    const schema = Joi.object({
      nombre: Joi.string().min(2).max(100).trim().required().messages({
        'string.min': 'El nombre debe tener al menos 2 caracteres',
        'string.max': 'El nombre no puede exceder 100 caracteres',
        'any.required': 'El nombre es obligatorio'
      }),
      email: Joi.string().email().lowercase().trim().required().messages({
        'string.email': 'El email debe tener un formato válido',
        'any.required': 'El email es obligatorio'
      })
    });

    const { error, value } = schema.validate(req.body, { stripUnknown: true });
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }
    
    req.body = value;
    next();
  }
};

module.exports = validationMiddleware;