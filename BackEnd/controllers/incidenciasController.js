const Incidencia = require('../models/incidencias.model');
const Empleado = require('../models/Empleado');

// Controladores para Incidencias
//obtiene todas las incidencias con el nombre del empleado asociado

const getIncidencias = async (req, res) => {

  try {

    const incidencias = await Incidencia.findAll({
      include: {
        model: Empleado,
        attributes: ['id', 'nombre']
      }
    });

    res.json(incidencias);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

const getIncidenciaById = async (req, res) => {

  try {

    const incidencia = await Incidencia.findByPk(req.params.id, {

      include: {
        model: Empleado,
        attributes: ['id', 'nombre']
      }

    });

    if (!incidencia) {

      return res.status(404).json({
        message: 'Incidencia no encontrada'
      });

    }

    res.status(200).json({
      message: 'Incidencia encontrada',
      incidencia
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Error al obtener incidencia'
    });

  }

};


// Crea una nueva incidencia    
const createIncidencia = async (req, res) => {

  try {

    const {
      empleado_id,
      fecha,
      tipo,
      descripcion,
      status
    } = req.body;

    // VALIDACIONES

    if (
      !empleado_id ||
      !fecha ||
      !tipo ||
      !descripcion ||
      !status
    ) {

      return res.status(400).json({
        message: 'Todos los campos son obligatorios'
      });

    }

    // VALIDAR EMPLEADO

    const empleado = await Empleado.findByPk(empleado_id);

    if (!empleado) {

      return res.status(404).json({
        message: 'Empleado no encontrado'
      });

    }

    // CREAR INCIDENCIA

    const incidencia = await Incidencia.create({
      empleado_id,
      fecha,
      tipo,
      descripcion,
      status
    });

    res.status(201).json({
      message: 'Incidencia creada correctamente',
      incidencia
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Error al crear incidencia'
    });

  }

};
// Actualiza una incidencia existente
const updateIncidencia = async (req, res) => {

  try {

    const { id } = req.params;

    const incidencia = await Incidencia.findByPk(id);

    if (!incidencia) {

      return res.status(404).json({
        message: 'Incidencia no encontrada'
      });

    }

    const {
      empleado_id,
      fecha,
      tipo,
      descripcion,
      status
    } = req.body;

    // VALIDACIONES

    if (
      !empleado_id ||
      !fecha ||
      !tipo ||
      !descripcion ||
      !status
    ) {

      return res.status(400).json({
        message: 'Todos los campos son obligatorios'
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

    await incidencia.update({
      empleado_id,
      fecha,
      tipo,
      descripcion,
      status
    });

    res.status(200).json({
      message: 'Incidencia actualizada correctamente',
      incidencia
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Error al actualizar incidencia'
    });

  }

};

// Elimina una incidencia
const deleteIncidencia = async (req, res) => {

  try {

    const { id } = req.params;

    const incidencia = await Incidencia.findByPk(id);

    if (!incidencia) {

      return res.status(404).json({
        message: 'Incidencia no encontrada'
      });

    }

    await incidencia.destroy();

    res.status(200).json({
      message: 'Incidencia eliminada correctamente'
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Error al eliminar incidencia'
    });

  }

};

// Obtiene las incidencias de un empleado específico
const getIncidenciasByEmpleado = async (req, res) => {

  try {

    const { empleado_id } = req.params;

    const incidencias = await Incidencia.findAll({

      where: {
        empleado_id
      },

      include: {
        model: Empleado,
        attributes: ['id', 'nombre']
      }

    });

    res.json(incidencias);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};


module.exports = {
  getIncidencias,
  getIncidenciaById,
  createIncidencia,
  updateIncidencia,
  deleteIncidencia,
  getIncidenciasByEmpleado,
};