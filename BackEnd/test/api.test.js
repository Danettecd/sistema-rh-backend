const path = require('path');

require('dotenv').config({
  path: path.join(__dirname, '..', '.env')
});

const app = require('../app');

let expect;
let request;

describe('SIGPA RH API', function () {
  let token;

  before(async function () {
    const chai = await import('chai');
    const chaiHttp = await import('chai-http');

    expect = chai.expect;
    chai.use(chaiHttp.default);
    request = chaiHttp.request;
  });

  it('POST /api/login con credenciales invalidas responde 400', async function () {
    const res = await request.execute(app)
      .post('/api/login')
      .send({});

    expect(res).to.have.status(400);
  });

  it('GET /empleados sin token responde 401', async function () {
    const res = await request.execute(app)
      .get('/empleados');

    expect(res).to.have.status(401);
  });

  it('POST /api/login con usuario valido responde token', async function () {
    if (!process.env.TEST_EMAIL || !process.env.TEST_PASSWORD) {
      this.skip();
    }

    const res = await request.execute(app)
      .post('/api/login')
      .send({
        email: process.env.TEST_EMAIL,
        password: process.env.TEST_PASSWORD
      });

    expect(res).to.have.status(200);
    expect(res.body).to.have.property('token').that.is.a('string');

    token = res.body.token;
  });

  it('GET /empleados con token responde 200', async function () {
    if (!token) {
      this.skip();
    }

    const res = await request.execute(app)
      .get('/empleados')
      .set('Authorization', `Bearer ${token}`);

    expect(res).to.have.status(200);
  });

  it('GET /vehiculos con token responde 200', async function () {
    if (!token) {
      this.skip();
    }

    const res = await request.execute(app)
      .get('/vehiculos')
      .set('Authorization', `Bearer ${token}`);

    expect(res).to.have.status(200);
  });

  it('GET /incidencias con token responde 200', async function () {
    if (!token) {
      this.skip();
    }

    const res = await request.execute(app)
      .get('/incidencias')
      .set('Authorization', `Bearer ${token}`);

    expect(res).to.have.status(200);
  });
});
