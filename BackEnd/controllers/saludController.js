const Salud = require('../models/salud.model');
const Empleado = require('../models/Empleado');


// GET
const getSalud = async (req, res) => {

  try {

    const salud = await Salud.findAll({
      include: {
        model: Empleado,
        attributes: ['id', 'nombre']
      }
    });

    res.json(salud);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

//obtener salud por ID
const getSaludById = async (req, res) => {

  try {

    const salud = await Salud.findByPk(req.params.id, {

      include: {
        model: Empleado,
        attributes: ['id', 'nombre']
      }

    });

    if (!salud) {

      return res.status(404).json({
        message: 'Registro no encontrado'
      });

    }

    res.status(200).json({
      message: 'Registro encontrado',
      salud
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Error al obtener registro de salud'
    });

  }

};
// POST
const createSalud = async (req, res) => {

  try {

    const {
      empleado_id,
      nss,
      clinica,
      tipo_sangre,
      padecimientos,
      contacto_emergencia,
      telefono_emergencia
    } = req.body;

    // VALIDACIONES

    if (!empleado_id || !nss) {

      return res.status(400).json({
        message: 'empleado_id y nss son obligatorios'
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

    const nuevaSalud = await Salud.create({
      empleado_id,
      nss,
      clinica,
      tipo_sangre,
      padecimientos,
      contacto_emergencia,
      telefono_emergencia
    });

    res.status(201).json({
      message: 'Registro de salud creado correctamente',
      nuevaSalud
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Error al crear registro de salud'
    });

  }

};


// PUT
const updateSalud = async (req, res) => {

  try {

    const salud = await Salud.findByPk(req.params.id);

    if (!salud) {

      return res.status(404).json({
        message: 'Registro no encontrado'
      });

    }

    const {
      empleado_id,
      nss,
      clinica,
      tipo_sangre,
      padecimientos,
      contacto_emergencia,
      telefono_emergencia
    } = req.body;

    // VALIDACIONES

    if (!empleado_id || !nss) {

      return res.status(400).json({
        message: 'empleado_id y nss son obligatorios'
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

    await salud.update({
      empleado_id,
      nss,
      clinica,
      tipo_sangre,
      padecimientos,
      contacto_emergencia,
      telefono_emergencia
    });

    res.status(200).json({
      message: 'Registro actualizado correctamente',
      salud
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Error al actualizar registro de salud'
    });

  }

};

const deleteSalud = async (req, res) => {

  try {

    const salud = await Salud.findByPk(req.params.id);

    if (!salud) {

      return res.status(404).json({
        message: 'Registro no encontrado'
      });

    }

    await salud.destroy();

    res.status(200).json({
      message: 'Registro eliminado correctamente'
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Error al eliminar registro de salud'
    });

  }

};

module.exports = {
  getSalud,
  getSaludById,
  createSalud,
  updateSalud,
  deleteSalud
};