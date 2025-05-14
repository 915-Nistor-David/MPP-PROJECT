const request = require('supertest');
const express = require('express');
const loansRouter = require('../routes/loans');

// We can create a new app for testing
const app = express();
app.use(express.json());
app.use('/loans', loansRouter);

describe('Loans API', () => {
  it('GET /loans should return an array of loans', async () => {
    const res = await request(app).get('/loans');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /loans should create a new loan', async () => {
    const newLoan = {
      name: "New Client",
      amount: 2000,
    };
    const res = await request(app)
      .post('/loans')
      .send(newLoan);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe("New Client");
    expect(res.body.amount).toBe(2000);
  });

  it('PATCH /loans/:id should update an existing loan', async () => {
    const res = await request(app)
      .patch('/loans/1')
      .send({ amount: 9999 });

    expect(res.statusCode).toBe(200);
    expect(res.body.amount).toBe(9999);
  });

  it('DELETE /loans/:id should remove a loan', async () => {
    const res = await request(app).delete('/loans/1');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
  });
});
