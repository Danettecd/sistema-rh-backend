const Vehiculo = require('../models/vehiculos.model');
//obtener todos los vehiculos
const getVehiculos = async (req, res) => {

  try {

    const vehiculos = await Vehiculo.findAll();

    res.json(vehiculos);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};
//obtener un vehiculo por id
const getVehiculoById = async (req, res) => {

  try {

    const { id } = req.params;

    const vehiculo = await Vehiculo.findByPk(id);

    if (!vehiculo) {

      return res.status(404).json({
        message: 'Vehículo no encontrado'
      });

    }

    res.status(200).json({
      message: 'Vehículo encontrado',
      vehiculo
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Error al obtener vehículo'
    });

  }

};

//crear un nuevo vehiculo
const createVehiculo = async (req, res) => {

  try {

    const {
      numeroVehiculo,
      fotoVehiculo,
      marca,
      modelo,
      anio,
      color,
      placas,
      numeroTarjetaCirculacion,
      vigenciaTarjeta,
      aseguradora,
      numeroPoliza,
      vigenciaPoliza
    } = req.body;

    // VALIDACIONES

    if (
      !numeroVehiculo ||
      !marca ||
      !modelo ||
      !anio ||
      !placas
    ) {

      return res.status(400).json({
        message: 'numeroVehiculo, marca, modelo, anio y placas son obligatorios'
      });

    }

    // CREAR VEHÍCULO

    const vehiculo = await Vehiculo.create({
      numeroVehiculo,
      fotoVehiculo,
      marca,
      modelo,
      anio,
      color,
      placas,
      numeroTarjetaCirculacion,
      vigenciaTarjeta,
      aseguradora,
      numeroPoliza,
      vigenciaPoliza
    });

    res.status(201).json({
      message: 'Vehículo registrado correctamente',
      vehiculo
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Error al registrar vehículo'
    });

  }

};

//editar un vehiculo existente
const updateVehiculo = async (req, res) => {

  try {

    const { id } = req.params;

    const vehiculo = await Vehiculo.findByPk(id);

    if (!vehiculo) {

      return res.status(404).json({
        message: 'Vehículo no encontrado'
      });

    }

    const {
      numeroVehiculo,
      fotoVehiculo,
      marca,
      modelo,
      anio,
      color,
      placas,
      numeroTarjetaCirculacion,
      vigenciaTarjeta,
      aseguradora,
      numeroPoliza,
      vigenciaPoliza
    } = req.body;

    // VALIDACIONES

    if (
      !numeroVehiculo ||
      !marca ||
      !modelo ||
      !anio ||
      !placas
    ) {

      return res.status(400).json({
        message: 'numeroVehiculo, marca, modelo, anio y placas son obligatorios'
      });

    }

    // ACTUALIZAR

    await vehiculo.update({
      numeroVehiculo,
      fotoVehiculo,
      marca,
      modelo,
      anio,
      color,
      placas,
      numeroTarjetaCirculacion,
      vigenciaTarjeta,
      aseguradora,
      numeroPoliza,
      vigenciaPoliza
    });

    res.status(200).json({
      message: 'Vehículo actualizado correctamente',
      vehiculo
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Error al actualizar vehículo'
    });

  }

};

//eliminar un vehiculo
const deleteVehiculo = async (req, res) => {

  try {

    const { id } = req.params;

    const vehiculo = await Vehiculo.findByPk(id);

    if (!vehiculo) {

      return res.status(404).json({
        message: 'Vehículo no encontrado'
      });

    }

    await vehiculo.destroy();

    res.status(200).json({
      message: 'Vehículo eliminado correctamente'
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Error al eliminar vehículo'
    });

  }

};

module.exports = {
  getVehiculos,
  getVehiculoById,
  createVehiculo,
  updateVehiculo,
  deleteVehiculo
};
