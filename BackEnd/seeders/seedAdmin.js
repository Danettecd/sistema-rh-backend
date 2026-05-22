const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function seedAdmin() {
  const {
    ADMIN_NAME,
    ADMIN_EMAIL,
    ADMIN_PASSWORD,
    ADMIN_ROLE
  } = process.env;

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    return;
  }

  const existingAdmin = await User.findOne({
    where: {
      email: ADMIN_EMAIL
    }
  });

  if (existingAdmin) {
    console.log('Admin seed omitido: el usuario ya existe');
    return;
  }

  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

  await User.create({
    nombre: ADMIN_NAME || 'Admin Docker',
    email: ADMIN_EMAIL,
    password: hashedPassword,
    role: ADMIN_ROLE || 'admin'
  });

  console.log(`Admin seed creado: ${ADMIN_EMAIL}`);
}

module.exports = seedAdmin;
