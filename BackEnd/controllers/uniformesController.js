const Uniforme = require('../models/uniformes.model');
const Empleado = require('../models/Empleado');


// GET TODOS
const getUniformes = async (req, res) => {

  try {

    const uniformes = await Uniforme.findAll({
      include: {
        model: Empleado,
        attributes: ['id', 'nombre']
      }
    });

    res.json(uniformes);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};


// GET POR ID
const getUniforme = async (req, res) => {

  try {

    const { id } = req.params;

    const uniforme = await Uniforme.findByPk(id, {

      include: {
        model: Empleado,
        attributes: ['id', 'nombre']
      }

    });

    if (!uniforme) {

      return res.status(404).json({
        message: 'Registro no encontrado'
      });

    }

    res.status(200).json({
      message: 'Registro encontrado',
      uniforme
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Error al obtener uniforme'
    });

  }

};

// GET POR EMPLEADO
const getUniformesPorEmpleado = async (req, res) => {

  try {

    const { id } = req.params;

    const uniformes = await Uniforme.findAll({
      where: {
        empleado_id: id
      },
      include: {
        model: Empleado,
        attributes: ['id', 'nombre']
      }
    });

    res.json(uniformes);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};


// POST
const createUniforme = async (req, res) => {

  try {

    const {
      empleado_id,
      tipo,
      descripcion,
      fecha_entrega,
      talla,
      color,
      observaciones
    } = req.body;

    // VALIDACIONES

    if (
      !empleado_id ||
      !tipo ||
      !descripcion ||
      !fecha_entrega
    ) {

      return res.status(400).json({
        message: 'empleado_id, tipo, descripcion y fecha_entrega son obligatorios'
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

    const nuevoUniforme = await Uniforme.create({
      empleado_id,
      tipo,
      descripcion,
      fecha_entrega,
      talla,
      color,
      observaciones
    });

    res.status(201).json({
      message: 'Uniforme registrado correctamente',
      nuevoUniforme
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Error al registrar uniforme'
    });

  }

};

// PUT
const updateUniforme = async (req, res) => {

  try {

    const { id } = req.params;

    const uniforme = await Uniforme.findByPk(id);

    if (!uniforme) {

      return res.status(404).json({
        message: 'Registro no encontrado'
      });

    }

    const {
      empleado_id,
      tipo,
      descripcion,
      fecha_entrega,
      talla,
      color,
      observaciones
    } = req.body;

    // VALIDACIONES

    if (
      !empleado_id ||
      !tipo ||
      !descripcion ||
      !fecha_entrega
    ) {

      return res.status(400).json({
        message: 'empleado_id, tipo, descripcion y fecha_entrega son obligatorios'
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

    await uniforme.update({
      empleado_id,
      tipo,
      descripcion,
      fecha_entrega,
      talla,
      color,
      observaciones
    });

    res.status(200).json({
      message: 'Registro actualizado correctamente',
      uniforme
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Error al actualizar uniforme'
    });

  }

};


// DELETE
const deleteUniforme = async (req, res) => {

  try {

    const { id } = req.params;

    const uniforme = await Uniforme.findByPk(id);

    if (!uniforme) {

      return res.status(404).json({
        message: 'Registro no encontrado'
      });

    }

    await uniforme.destroy();

    res.status(200).json({
      message: 'Registro eliminado correctamente'
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Error al eliminar uniforme'
    });

  }

};

module.exports = {
  getUniformes,
  getUniforme,
  createUniforme,
  updateUniforme,
  deleteUniforme,
  getUniformesPorEmpleado
};