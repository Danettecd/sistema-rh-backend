const Incapacidad = require('../models/incapacidad.model');
const Empleado = require('../models/Empleado');

// GET
const getIncapacidades = async (req, res) => {

  try {

    const incapacidades = await Incapacidad.findAll({
      include: {
        model: Empleado,
        attributes: ['id', 'nombre']
      }
    });

    const incapacidadesConDias = incapacidades.map(i => {

      let dias = null;

      if (i.fecha_inicio && i.fecha_fin) {

        const inicio = new Date(i.fecha_inicio);
        const fin = new Date(i.fecha_fin);

        dias = Math.ceil(
          (fin - inicio) / (1000 * 60 * 60 * 24)
        ) + 1;

      }

      return {
        ...i.toJSON(),
        dias
      };

    });

    res.json(incapacidadesConDias);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

// GET POR ID
const getIncapacidadById = async (req, res) => {

  try {

    const incapacidad = await Incapacidad.findByPk(req.params.id, {

      include: {
        model: Empleado,
        attributes: ['id', 'nombre']
      }

    });

    if (!incapacidad) {

      return res.status(404).json({
        message: 'Registro no encontrado'
      });

    }

    let dias = null;

    if (incapacidad.fecha_inicio && incapacidad.fecha_fin) {

      const inicio = new Date(incapacidad.fecha_inicio);

      const fin = new Date(incapacidad.fecha_fin);

      dias = Math.ceil(
        (fin - inicio) / (1000 * 60 * 60 * 24)
      ) + 1;

    }

    res.status(200).json({
      message: 'Registro encontrado',
      incapacidad: {
        ...incapacidad.toJSON(),
        dias
      }
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Error al obtener incapacidad'
    });

  }

};

// POST
const createIncapacidad = async (req, res) => {

  try {

    const {
      empleado_id,
      fecha_inicio,
      fecha_fin,
      motivo
    } = req.body;

    // VALIDACIONES

    if (
      !empleado_id ||
      !fecha_inicio ||
      !fecha_fin ||
      !motivo
    ) {

      return res.status(400).json({
        message: 'empleado_id, fecha_inicio, fecha_fin y motivo son obligatorios'
      });

    }

    // VALIDAR EMPLEADO

    const empleado = await Empleado.findByPk(empleado_id);

    if (!empleado) {

      return res.status(404).json({
        message: 'Empleado no encontrado'
      });

    }

    // CALCULAR DÍAS

    const inicio = new Date(fecha_inicio);
    const fin = new Date(fecha_fin);

    if (fin < inicio) {
      return res.status(400).json({
        message: 'La fecha de terminacion no puede ser menor a la fecha de inicio'
      });
    }

    const dias = Math.ceil(
      (fin - inicio) / (1000 * 60 * 60 * 24)
    ) + 1;

    // CREAR REGISTRO

    const nuevaIncapacidad = await Incapacidad.create({
      empleado_id,
      fecha_inicio,
      fecha_fin,
      motivo,
    });

    res.status(201).json({
      message: 'Incapacidad registrada correctamente',
      incapacidad: {
        ...nuevaIncapacidad.toJSON(),
        dias
      }
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Error al registrar incapacidad'
    });

  }

};

// PUT
const updateIncapacidad = async (req, res) => {

  try {

    const incapacidad = await Incapacidad.findByPk(req.params.id);

    if (!incapacidad) {

      return res.status(404).json({
        message: 'Registro no encontrado'
      });

    }

    const {
      empleado_id,
      fecha_inicio,
      fecha_fin,
      motivo
    } = req.body;

    // VALIDACIONES

    if (
      !empleado_id ||
      !fecha_inicio ||
      !fecha_fin ||
      !motivo
    ) {

      return res.status(400).json({
        message: 'empleado_id, fecha_inicio, fecha_fin y motivo son obligatorios'
      });

    }

    // VALIDAR EMPLEADO

    const empleado = await Empleado.findByPk(empleado_id);

    if (!empleado) {

      return res.status(404).json({
        message: 'Empleado no encontrado'
      });

    }

    // CALCULAR DÍAS

    const inicio = new Date(fecha_inicio);
    const fin = new Date(fecha_fin);

    if (fin < inicio) {
      return res.status(400).json({
        message: 'La fecha de terminacion no puede ser menor a la fecha de inicio'
      });
    }

    const dias = Math.ceil(
      (fin - inicio) / (1000 * 60 * 60 * 24)
    ) + 1;

    // ACTUALIZAR

    await incapacidad.update({
      empleado_id,
      fecha_inicio,
      fecha_fin,
      motivo
    });

    res.status(201).json({
      message: 'Incapacidad registrada correctamente',
      incapacidad: {
        ...incapacidad.toJSON(),
        dias
      }
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Error al actualizar incapacidad'
    });

  }

};

// DELETE
const deleteIncapacidad = async (req, res) => {

  try {

    const incapacidad = await Incapacidad.findByPk(req.params.id);

    if (!incapacidad) {

      return res.status(404).json({
        message: 'Registro no encontrado'
      });

    }

    await incapacidad.destroy();

    res.status(200).json({
      message: 'Incapacidad eliminada correctamente'
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Error al eliminar incapacidad'
    });

  }

};

module.exports = {
  getIncapacidades,
  getIncapacidadById,
  createIncapacidad,
  updateIncapacidad,
  deleteIncapacidad
};
