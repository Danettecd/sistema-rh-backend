const Presion = require('../models/presion.model');
const Empleado = require('../models/Empleado');


// GET
const getPresiones = async (req, res) => {

  try {

    const presiones = await Presion.findAll({
      include: {
        model: Empleado,
        attributes: ['id', 'nombre']
      }
    });

    res.json(presiones);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

//obtener presion por ID
const getPresionById = async (req, res) => {

  try {

    const presion = await Presion.findByPk(req.params.id, {

      include: {
        model: Empleado,
        attributes: ['id', 'nombre']
      }

    });

    if (!presion) {

      return res.status(404).json({
        message: 'Registro no encontrado'
      });

    }

    res.status(200).json({
      message: 'Registro encontrado',
      presion
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Error al obtener presión'
    });

  }

};

// POST
const createPresion = async (req, res) => {

  try {

    const {
      empleado_id,
      fecha,
      presion,
      observaciones
    } = req.body;

    // VALIDACIONES

    if (
      !empleado_id ||
      !fecha
    ) {

      return res.status(400).json({
        message: 'empleado_id y fecha son obligatorios'
      });

    }

    // VALIDAR EMPLEADO

    const empleado = await Empleado.findByPk(empleado_id);

    if (!empleado) {

      return res.status(404).json({
        message: 'Empleado no encontrado'
      });

    }

    // CREAR REGISTRO

    const nuevaPresion = await Presion.create({
      empleado_id,
      fecha,
      presion,
      observaciones
    });

    res.status(201).json({
      message: 'Registro de presión creado correctamente',
      nuevaPresion
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Error al registrar presión'
    });

  }

};
// PUT
const updatePresion = async (req, res) => {

  try {

    const presionRegistro = await Presion.findByPk(req.params.id);

    if (!presionRegistro) {

      return res.status(404).json({
        message: 'Registro no encontrado'
      });

    }

    const {
      empleado_id,
      fecha,
      presion,
      observaciones
    } = req.body;

    // VALIDACIONES

    if (
      !empleado_id ||
      !fecha
    ) {

      return res.status(400).json({
        message: 'empleado_id y fecha son obligatorios'
      });

    }

    // VALIDAR EMPLEADO

    const empleado = await Empleado.findByPk(empleado_id);

    if (!empleado) {

      return res.status(404).json({
        message: 'Empleado no encontrado'
      });

    }

    // ACTUALIZAR

    await presionRegistro.update({
      empleado_id,
      fecha,
      presion,
      observaciones
    });

    res.status(200).json({
      message: 'Registro actualizado correctamente',
      presionRegistro
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Error al actualizar presión'
    });

  }

};

// DELETE
const deletePresion = async (req, res) => {

  try {

    const presion = await Presion.findByPk(req.params.id);

    if (!presion) {

      return res.status(404).json({
        message: 'Registro no encontrado'
      });

    }

    await presion.destroy();

    res.status(200).json({
      message: 'Registro eliminado correctamente'
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Error al eliminar registro'
    });

  }

};


module.exports = {
  getPresiones,
  getPresionById,
  createPresion,
  updatePresion,
  deletePresion
};