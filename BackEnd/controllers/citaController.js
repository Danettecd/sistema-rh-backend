const Cita = require('../models/cita.model');
const Empleado = require('../models/Empleado');


// GET
const getCitas = async (req, res) => {

  try {

    const citas = await Cita.findAll({
      include: {
        model: Empleado,
        attributes: ['id', 'nombre']
      }
    });

    res.json(citas);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};
//obtener cita por ID
const getCitaById = async (req, res) => {

  try {

    const cita = await Cita.findByPk(req.params.id, {

      include: {
        model: Empleado,
        attributes: ['id', 'nombre']
      }

    });

    if (!cita) {

      return res.status(404).json({
        message: 'Cita no encontrada'
      });

    }

    res.status(200).json({
      message: 'Cita encontrada',
      cita
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Error al obtener cita'
    });

  }

};

// POST
const createCita = async (req, res) => {

  try {

    const {
      empleado_id,
      fecha,
      hora,
      especialidad,
      comentarios
    } = req.body;

    // VALIDACIONES

    if (
      !empleado_id ||
      !fecha ||
      !especialidad
    ) {

      return res.status(400).json({
        message: 'empleado_id, fecha y especialidad son obligatorios'
      });

    }

    // VALIDAR EMPLEADO

    const empleado = await Empleado.findByPk(empleado_id);

    if (!empleado) {

      return res.status(404).json({
        message: 'Empleado no encontrado'
      });

    }

    // CREAR CITA

    const nuevaCita = await Cita.create({
      empleado_id,
      fecha,
      hora,
      especialidad,
      comentarios
    });

    res.status(201).json({
      message: 'Cita registrada correctamente',
      nuevaCita
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Error al registrar cita'
    });

  }

};

//edirtar cita
const updateCita = async (req, res) => {

  try {

    const cita = await Cita.findByPk(req.params.id);

    if (!cita) {

      return res.status(404).json({
        message: 'Cita no encontrada'
      });

    }

    const {
      empleado_id,
      fecha,
      hora,
      especialidad,
      comentarios
    } = req.body;

    // VALIDACIONES

    if (
      !empleado_id ||
      !fecha ||
      !especialidad
    ) {

      return res.status(400).json({
        message: 'empleado_id, fecha y especialidad son obligatorios'
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

    await cita.update({
      empleado_id,
      fecha,
      hora,
      especialidad,
      comentarios
    });

    res.status(200).json({
      message: 'Cita actualizada correctamente',
      cita
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Error al actualizar cita'
    });

  }

};

// DELETE
const deleteCita = async (req, res) => {

  try {

    const cita = await Cita.findByPk(req.params.id);

    if (!cita) {

      return res.status(404).json({
        message: 'Cita no encontrada'
      });

    }

    await cita.destroy();

    res.status(200).json({
      message: 'Cita eliminada correctamente'
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Error al eliminar cita'
    });

  }

};


module.exports = {
  getCitas,
  getCitaById,
  createCita,
  updateCita,
  deleteCita
};