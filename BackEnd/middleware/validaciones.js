function validarEmpleado(req, res, next) {
  console.log('Validar empleado body:', req.body);
  console.log('Validar empleado file:', req.file);

  const {
    nombre,
    email,
    telefono,
    fechaIngreso,
    fechaNacimiento
  } = req.body;

  if (!nombre || nombre.trim() === '') {
    return res.status(400).json({ message: 'El nombre es obligatorio' });
  }

  if (email?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: 'El email no tiene un formato válido' });
  }

  if (telefono?.trim() && !/^[0-9\s()+-]{7,20}$/.test(telefono)) {
    return res.status(400).json({ message: 'El teléfono no tiene un formato válido' });
  }

  if (fechaIngreso?.trim() && isNaN(Date.parse(fechaIngreso))) {
    return res.status(400).json({ message: 'La fecha de ingreso no es válida' });
  }

  if (fechaNacimiento?.trim() && isNaN(Date.parse(fechaNacimiento))) {
    return res.status(400).json({ message: 'La fecha de nacimiento no es válida' });
  }

  next();
}

module.exports = {
  validarEmpleado
};
