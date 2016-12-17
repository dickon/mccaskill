import { Component } from '@angular/core';
import { Http, Response } from '@angular/http';
import { AppState } from '../app.service';
import { Title } from './title';
import { XLarge } from './x-large';
import { Observable } from 'rxjs/Rx';
import * as d3 from 'd3';
import * as scale from 'd3-scale';


function rgbTemperature(temp: number) {
  // from http://stackoverflow.com/questions/3407942/rgb-values-of-visible-spectrum

  var l = d3.scaleLinear().domain([5,35]).range([400, 700])(temp);
  var t = 0;
  var r = 0, g = 0, b = 0;
  if ((l>=400.0)&&(l<410.0)) { t=(l-400.0)/(410.0-400.0); r=    +(0.33*t)-(0.20*t*t); }
  else if ((l>=410.0)&&(l<475.0)) { t=(l-410.0)/(475.0-410.0); r=0.14         -(0.13*t*t); }
  else if ((l>=545.0)&&(l<595.0)) { t=(l-545.0)/(595.0-545.0); r=    +(1.98*t)-(     t*t); }
  else if ((l>=595.0)&&(l<650.0)) { t=(l-595.0)/(650.0-595.0); r=0.98+(0.06*t)-(0.40*t*t); }
  else if ((l>=650.0)&&(l<700.0)) { t=(l-650.0)/(700.0-650.0); r=0.65-(0.84*t)+(0.20*t*t); }
        if ((l>=415.0)&&(l<475.0)) { t=(l-415.0)/(475.0-415.0); g=             +(0.80*t*t); }
  else if ((l>=475.0)&&(l<590.0)) { t=(l-475.0)/(590.0-475.0); g=0.8 +(0.76*t)-(0.80*t*t); }
  else if ((l>=585.0)&&(l<639.0)) { t=(l-585.0)/(639.0-585.0); g=0.84-(0.84*t)           ; }
        if ((l>=400.0)&&(l<475.0)) { t=(l-400.0)/(475.0-400.0); b=    +(2.20*t)-(1.50*t*t); }
  else if ((l>=475.0)&&(l<560.0)) { t=(l-475.0)/(560.0-475.0); b=0.7 -(     t)+(0.30*t*t); }
  return `rgb(${Math.floor(r*256)}, ${Math.floor(g*256)}, ${Math.floor(b*256)})`;
}

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'home'
  selector: 'home',  // <home></home>
  // We need to tell Angular's Dependency Injection which providers are in our app.
  providers: [
    Title
  ],
  // Our list of styles in our component. We may add more to compose many styles together
  styleUrls: [ './home.component.css' ],
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: './home.component.html'
})
export class HomeComponent {
  // Set our default values
  localState = { value: '' };
  // TypeScript public modifiers
  constructor(public appState: AppState, public title: Title, private http: Http) {

  }

  ngOnInit() {
    console.log('hello `Home` component');
    this.http.get('http://localhost:3001/dickon').subscribe( (res: Response) => {
      let zones = res.json();
      console.log(res.text());
      let newrows = d3.select('#zonesTable').selectAll('tr').data(zones).enter().append('tr')
      newrows.append('td').attr('id', (z: any) => z.zoneName + 'Label')
        .attr('class', 'ZoneLabel');
      newrows.append('td').attr('id', (z: any) => z.zoneName + 'Temperature')
        .attr('class', 'ZoneTemperature');
      d3.select('#zonesTable').selectAll('.ZoneTemperature')
        .data(zones).text((z: any) => z.temperature)
        .attr('style', ((z:any) => 'background-color: '+rgbTemperature(z.temperature)));
      d3.select('#zonesTable').selectAll('.ZoneLabel').data(zones).text((z: any) => z.zoneName);

    });
    // this.title.getData().subscribe(data => this.data = data);
  }

  submitState(value: string) {
    console.log('submitState', value);
    this.appState.set('value', value);
    this.localState.value = '';
  }
}
