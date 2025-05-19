// backend/index.js

const express   = require('express');
const cors      = require('cors');
const http      = require('http');
const { Server }= require('socket.io');
const { Loan, Borrower } = require('./models');
const loansRouter     = require('./routes/loans');
const borrowersRouter = require('./routes/borrowers');

const app  = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use('/loans',     loansRouter);
app.use('/borrowers', borrowersRouter);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// wrap Express in an HTTP server
const server = http.createServer(app);
const io     = new Server(server, { cors: { origin: '*' } });

// on WS connect
io.on('connection', socket => {
  console.log('→ client connected for live loans');
  // you could emit initial data here if you like...
});

// every 10s: generate a fully-formed loan via Sequelize
setInterval(async () => {
  try {
    // pick a random borrower
    const count = await Borrower.count();
    const randomOffset = Math.floor(Math.random() * count);
    const b = await Borrower.findOne({ offset: randomOffset });

    if (!b) return;

    const dummy = await Loan.create({
      borrowerId: b.id,
      amount:        Math.floor(Math.random() * 9000) + 1000,
      interestRate:  parseFloat((Math.random() * 10).toFixed(2)),
      dueDate:       new Date().toISOString().slice(0,10),
      period:        [6,12,24,36][Math.floor(Math.random()*4)],
      lifeInsurance: Math.random() > 0.5
    });

    // reload with borrower included
    const fullDummy = await Loan.findByPk(dummy.id, { include: ['borrower'] });
    io.emit('new-loan', fullDummy);
    console.log('↪ emitted new-loan', fullDummy.id);
  } catch (err) {
    console.error('Error generating dummy loan:', err);
  }
}, 10_000);

server.listen(port, () =>
  console.log(`Server running (HTTP+WS) on http://localhost:${port}`)
);
