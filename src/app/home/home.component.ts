import { Component } from '@angular/core';
import { Http, Response } from '@angular/http';
import { AppState } from '../app.service';
import { Title } from './title';
import { XLarge } from './x-large';
import { Observable } from 'rxjs/Rx';
import * as d3 from 'd3';

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
    this.http.get('http://localhost:3001/mock').subscribe( (res: Response) => {
      let zones = res.json();
      console.log(res.text());
      let newrows = d3.select('#zonesTable').selectAll('tr').data(zones).enter().append('tr')
      newrows.append('td').attr('id', (z: any) => z.zoneName + 'Label')
        .attr('class', 'ZoneLabel');
      newrows.append('td').attr('id', (z: any) => z.zoneName + 'Temperature')
        .attr('class', 'ZoneTemperature');
      d3.select('#zonesTable').selectAll('.ZoneTemperature')
        .data(zones).text((z: any) => z.temperature);
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
