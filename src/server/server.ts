import * as express from 'express';

let app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/mock', (req, res) => {
  res.send('DICKONSTUDY');
});

app.listen(3001, () => console.log('started on port 3001'));
