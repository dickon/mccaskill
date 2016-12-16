import * as express from 'express';

let app = express();

app.get('/mock', (req, res) => {
  res.send('DICKONSTUDY');
});

app.listen(3001, () => console.log('started on port 3001'));
