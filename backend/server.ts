import * as express from 'express';
import * as fs from 'fs';
import * as https from 'https';
import { IncomingMessage } from 'http';
import * as querystring from 'querystring';

let app = express();

let text = fs.readFileSync('credentials.json', 'utf8');
interface Credentials {
  username: string;
  password: string;
  deviceid: string;
}

interface LoginResponse {
  access_token: string;
}

let credentials: Credentials = JSON.parse(text);
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Header', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/mock', (req, res) => {
  res.send('DICKONSTUDY');
});


function login() {
  console.log('getData starting v2');
  const data = {
    'Content-Type':	'application/x-www-form-urlencoded; charset=utf-8',
    'Host':	'rs.alarmnet.com/',
    'Cache-Control': 'no-store no-cache',
    'Pragma':	'no-cache',
    'grant_type':	'password',
    'scope': 'EMEA-V1-Basic EMEA-V1-Anonymous EMEA-V1-Get-Current-User-Account',
    'Username': credentials.username,
    'Password':	credentials.password,
    'Connection':	'Keep-Alive'
  };

  let postReq = https.request({
    host: 'tccna.honeywell.com',
    port: 443,
    path: '/Auth/OAuth/Token',
    auth: credentials.username + ':' + credentials.password,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      Authorization:	'Basic YjAxM2FhMjYtOTcyNC00ZGJkLTg4OTctMDQ4YjlhYWRhMjQ5OnRlc3Q=',
      Accept: 'application/json, application/xml, text/json, '+
              'text/x-json, text/javascript, text/xml',
    }
  }, (res: IncomingMessage ) => {
    console.log('got response');
    console.log('statusCode:', res.statusCode);
    res.setEncoding('utf8');
    res.on('data', (d: string) => {
      let login : LoginResponse = JSON.parse(d);
      console.log('data', login.access_token);
    });
  });
  postReq.write(querystring.stringify(data));
  postReq.end();
}

console.log(`user ${credentials.username}`);

app.get('/dickon', (req, res) => {
  login();
});

login();

app.listen(3001, () => console.log('started on port 3001'));

