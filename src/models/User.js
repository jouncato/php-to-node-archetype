class User {
  constructor(data) {
    this.id = data.id || null;
    this.nombre = data.nombre;
    this.email = data.email;
    this.password = data.password; // Debe estar hasheado
    this.fecha_registro = data.fecha_registro || new Date();
  }

  // Métodos de validación o lógica de negocio específica del modelo pueden ir aquí
  // Por ejemplo, verificar si el email es válido
  isValidEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email);
  }

  // Preparar para inserción en base de datos (omitir campos calculados)
  toDatabaseRow() {
    return {
      nombre: this.nombre,
      email: this.email,
      password: this.password,
      fecha_registro: this.fecha_registro
    };
  }

  // Preparar para respuesta JSON (omitir password)
  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      email: this.email,
      fecha_registro: this.fecha_registro
    };
  }
}

module.exports = User;