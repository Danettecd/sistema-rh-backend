const Empleado = require('../models/Empleado');

function getFotoPath(file) {
  return file ? `/uploads/empleados/${file.filename}` : null;
}

const limpiarFecha = (fecha, fechaAnterior = null) => {
  if (!fecha || fecha === "Invalid date" || fecha === "undefined" || fecha === "null") {
    return fechaAnterior || null;
  }

  return fecha;
};

// GET todos
const obtenerEmpleados = async (req, res) => {

  try {

    const empleados = await Empleado.findAll();

    res.json(empleados);

  } catch (error) {

    console.error(error);

    res.status(500).send("Error al obtener empleados");
  }

};


// GET por ID
const obtenerEmpleadoPorId = async (req, res) => {

  try {

    const id = req.params.id;

    const empleado = await Empleado.findByPk(id);

    if (!empleado) {

      return res.status(404).json({
        mensaje: 'Empleado no encontrado'
      });

    }

    res.status(200).json({
      mensaje: 'Empleado encontrado',
      empleado
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mensaje: 'Error al obtener empleado'
    });

  }

};


// POST
const crearEmpleado = async (req, res) => {

  try {

    const {
      nombre,
      puesto,
      telefono,
      direccion,
      email,
      rfc,
      curp,
      nss,
      fechaIngreso,
      fechaNacimiento
    } = req.body;
    const foto = getFotoPath(req.file);

    // VALIDACIONES

    if (!nombre) {

      return res.status(400).json({
        mensaje: 'El nombre es obligatorio'
      });

    }

    // CREAR EMPLEADO

    const empleado = await Empleado.create({
      nombre,
      puesto,
      telefono,
      direccion,
      email,
      rfc,
      curp,
      nss,
      fechaIngreso: null,
      fechaNacimiento: null,
      foto
    });

    res.status(201).json({
      mensaje: 'Empleado creado correctamente',
      empleado
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mensaje: 'Error al crear empleado'
    });

  }

};


// PUT
const actualizarEmpleado = async (req, res) => {

  try {

    const id = req.params.id;

    const empleado = await Empleado.findByPk(id);

    if (!empleado) {

      return res.status(404).json({
        mensaje: 'Empleado no encontrado'
      });

    }

    const {
      nombre,
      puesto,
      telefono,
      direccion,
      email,
      rfc,
      curp,
      nss,
      fechaIngreso,
      fechaNacimiento
    } = req.body;
    const fotoFinal = req.file
      ? `/uploads/empleados/${req.file.filename}`
      : empleado.foto || null;
    const fechaIngresoFinal = limpiarFecha(req.body.fechaIngreso, empleado.fechaIngreso);
    const fechaNacimientoFinal = limpiarFecha(req.body.fechaNacimiento, empleado.fechaNacimiento);

    console.log("Foto anterior:", empleado.foto);
    console.log("Nueva foto:", req.file?.filename);
    console.log("Foto final:", fotoFinal);

    // VALIDACIÓN

    if (!nombre) {

      return res.status(400).json({
        mensaje: 'El nombre es obligatorio'
      });

    }

    // ACTUALIZAR

    await empleado.update({
      nombre,
      puesto,
      telefono,
      direccion,
      email,
      rfc,
      curp,
      nss,
      fechaIngreso: fechaIngresoFinal,
      fechaNacimiento: fechaNacimientoFinal,
      foto: fotoFinal
    });

    res.status(200).json({
      mensaje: 'Empleado actualizado correctamente',
      empleado
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mensaje: 'Error al actualizar empleado'
    });

  }

};


// DELETE
const eliminarEmpleado = async (req, res) => {

  try {

    const id = req.params.id;

    const empleado = await Empleado.findByPk(id);

    if (!empleado) {

      return res.status(404).json({
        mensaje: 'Empleado no encontrado'
      });

    }

    await empleado.destroy();

    res.status(200).json({
      mensaje: 'Empleado eliminado correctamente'
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mensaje: 'Error al eliminar empleado'
    });

  }

};


module.exports = {
  obtenerEmpleados,
  obtenerEmpleadoPorId,
  crearEmpleado,
  actualizarEmpleado,
  eliminarEmpleado
};
