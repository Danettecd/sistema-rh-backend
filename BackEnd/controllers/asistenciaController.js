const Asistencia = require('../models/asistencia.model');
const Empleado = require('../models/Empleado');

const getAsistencias = async (req, res) => {

  try {

    const asistencias = await Asistencia.findAll({
      include: {
        model: Empleado,
        attributes: ['id', 'nombre']
      }
    });

    res.json(asistencias);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

// GET ASISTENCIA POR ID
const getAsistenciaById = async (req, res) => {

  try {

    const asistencia = await Asistencia.findByPk(req.params.id, {
      include: {
        model: Empleado,
        attributes: ['id', 'nombre']
      }
    });

    if (!asistencia) {

      return res.status(404).json({
        message: 'Asistencia no encontrada'
      });

    }

    res.json(asistencia);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

const getAsistenciaByEmpleado = async (req, res) => {

  try {

    const asistencias = await Asistencia.findAll({
      where: {
        employeeId: req.params.employeeId
      },
      include: {
        model: Empleado,
        attributes: ['id', 'nombre']
      }
    });

    res.json(asistencias);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

const createAsistencia = async (req, res) => {

  try {

    const {
      type,
      date,
      description,
      hours,
      employeeId
    } = req.body;

    // VALIDACIONES

    if (!type || !date || !employeeId) {

      return res.status(400).json({
        message: 'type, date y employeeId son obligatorios'
      });

    }

    // VALIDAR EMPLEADO

    const empleado = await Empleado.findByPk(employeeId);

    if (!empleado) {

      return res.status(404).json({
        message: 'Empleado no encontrado'
      });

    }

    // VALIDAR HORAS EXTRA

    if (type === 'horas_extra' && !hours) {

      return res.status(400).json({
        message: 'Debes agregar las horas extras'
      });

    }

    // CREAR ASISTENCIA

    const asistencia = await Asistencia.create({
      type,
      date,
      description,
      hours,
      employeeId
    });

    res.status(201).json({
      message: 'Asistencia creada correctamente',
      asistencia
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Error al crear asistencia'
    });

  }

};

const updateAsistencia = async (req, res) => {

  try {

    const asistencia = await Asistencia.findByPk(req.params.id);

    if (!asistencia) {

      return res.status(404).json({
        message: 'Asistencia no encontrada'
      });

    }

    const {
      type,
      date,
      description,
      hours,
      employeeId
    } = req.body;

    // VALIDACIONES

    if (!type || !date || !employeeId) {

      return res.status(400).json({
        message: 'type, date y employeeId son obligatorios'
      });

    }

    // VALIDAR EMPLEADO

    const empleado = await Empleado.findByPk(employeeId);

    if (!empleado) {

      return res.status(404).json({
        message: 'Empleado no encontrado'
      });

    }

    // VALIDAR HORAS EXTRA

    if (type === 'horas_extra' && !hours) {

      return res.status(400).json({
        message: 'Debes agregar las horas extras'
      });

    }

    // ACTUALIZAR

    await asistencia.update({
      type,
      date,
      description,
      hours,
      employeeId
    });

    res.status(200).json({
      message: 'Asistencia actualizada correctamente',
      asistencia
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Error al actualizar asistencia'
    });

  }

};

// ELIMINAR ASISTENCIA
const deleteAsistencia = async (req, res) => {

  try {

    const asistencia = await Asistencia.findByPk(req.params.id);

    if (!asistencia) {

      return res.status(404).json({
        message: 'Asistencia no encontrada'
      });

    }

    await asistencia.destroy();

    res.status(200).json({
      message: 'Asistencia eliminada correctamente'
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Error al eliminar asistencia'
    });

  }

};

module.exports = {
  getAsistencias,
  getAsistenciaById,
  getAsistenciaByEmpleado,
  createAsistencia,
  updateAsistencia,
  deleteAsistencia
};