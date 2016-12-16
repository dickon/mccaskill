import * as express from 'express';
import * as fs from 'fs';
import * as https from 'https';
import { IncomingMessage } from 'http';
import * as querystring from 'querystring';

let app = express();

interface Credentials {
  username: string;
  password: string;
  deviceid: string;
}

interface LoginResponse {
  access_token: string;
}

interface AccountInfo {
  userId: string;
  username: string;
  firstname: string;
  lastname: string;
  streetAddress: string;
  city: string;
  postcode: string;
  country: string;
  language: string;
}


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Header', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

class Zone {
  constructor(public zoneId: string, public zoneName: string, public zoneType: string,
              public locationId: string, public locationName: string) {
  }
}

class HoneywellClient {
  public zones: Zone[] = [];
  private _accessToken: string;
  private _account: AccountInfo;
  private _credentials: Credentials;
  login() {
    const text = fs.readFileSync('credentials.json', 'utf8');
    this._credentials = JSON.parse(text);
    console.log('getData starting v2');
    const data = {
      'Content-Type':	'application/x-www-form-urlencoded; charset=utf-8',
      'Host':	'rs.alarmnet.com/',
      'Cache-Control': 'no-store no-cache',
      'Pragma':	'no-cache',
      'grant_type':	'password',
      'scope': 'EMEA-V1-Basic EMEA-V1-Anonymous EMEA-V1-Get-Current-User-Account',
      'Username': this._credentials.username,
      'Password':	this._credentials.password,
      'Connection':	'Keep-Alive'
    };

    let postReq = https.request({
      host: 'tccna.honeywell.com',
      port: 443,
      path: '/Auth/OAuth/Token',
      auth: this._credentials.username + ':' + this._credentials.password,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        Authorization:	'Basic YjAxM2FhMjYtOTcyNC00ZGJkLTg4OTctMDQ4YjlhYWRhMjQ5OnRlc3Q=',
        Accept: 'application/json, application/xml, text/json, ' +
                'text/x-json, text/javascript, text/xml',
      }
    }, (res: IncomingMessage ) => {
      res.setEncoding('utf8');
      res.on('data', (d: string) => {
        let login: LoginResponse = JSON.parse(d);
        this._accessToken = login.access_token;
        this.getUserAccount();
      });
    });
    postReq.write(querystring.stringify(data));
    postReq.end();
  }

  getUserAccount() {
    https.get({
      host: 'tccna.honeywell.com',
      headers: {
        Authorization: `bearer ${this._accessToken}`,
        applicationId : 'b013aa26-9724-4dbd-8897-048b9aada249',
        Accept: 'application/json, application/xml, text/json, ' +
              'text/x-json, text/javascript, text/xml'
      },
      path: '/WebAPI/emea/api/v1/userAccount'},
      ((res2: IncomingMessage) => {
          res2.setEncoding('utf8');
          res2.on('data', (d2: string) => {
            this._account = JSON.parse(d2);
            this.getInstallation();
          });
      }));
  }

  getInstallation() {
     https.get({
      host: 'tccna.honeywell.com',
      headers: {
        Authorization: `bearer ${this._accessToken}`,
        applicationId : 'b013aa26-9724-4dbd-8897-048b9aada249',
        Accept: 'application/json, application/xml, text/json, ' +
              'text/x-json, text/javascript, text/xml'
      },
      path: `/WebAPI/emea/api/v1/location/installationInfo?userId=${this._account.userId}` +
            `&includeTemperatureControlSystems=True`},
      ((res: IncomingMessage) => {
          res.setEncoding('utf8');
          res.on('data', (data: string) => {
            console.log(`get ${data}`);
            const obj = JSON.parse(data);
            console.log(`first ${obj[0].gateways}`);
            for (let location of obj) {
              for (let gateway of location.gateways) {
                for (let system of gateway.temperatureControlSystems) {
                  for (let zone of system.zones) {
                    const nzone = new Zone(zone.zoneId, zone.name, zone.zoneType,
                                           location.locationId, location.name);
                    this.zones.push(nzone);
                  }
                }
              }
            }
          });
      }));
  }

}

let hcli = (new HoneywellClient());
hcli.login();

app.get('/dickon', (req, res) => {
  res.send(JSON.stringify(hcli.zones.map((zone: Zone) => zone.zoneName).join()));
});

app.get('/mock', (req, res) => {
  res.send(JSON.stringify(['LivingRoom', 'MasterBed', 'Ensuite', 'DressingRoom', 'DickonStudy',
     'DiningRoom', 'GuestSuite', 'Kitchen', 'Utility', 'DownOther', 'ServerRoom', 'JennyStudy']));
});

app.listen(3001, () => console.log('started on port 3001'));

