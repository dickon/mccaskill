import * as express from 'express';
import * as fs from 'fs';

let app = express();

let text = fs.readFileSync('credentials.json', 'utf8');
interface Credentials {
  username: string;
  password: string;
  deviceid: string
}
let credentials: Credentials= JSON.parse(text);
console.log(`user ${credentials.username}`);
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/mock', (req, res) => {
  res.send('DICKONSTUDY');
});


app.get('/dickon', (req, res) => {
});

app.listen(3001, () => console.log('started on port 3001'));
