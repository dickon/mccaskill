import { browser, by, element } from 'protractor';

describe('App', () => {

  beforeEach(() => {
    // change hash depending on router LocationStrategy
    browser.get('/#/home');
  });


  it('should have some kind of title', () => {
    let subject = browser.getTitle();
    let result  = 'Angular2 Webpack Starter by @gdi2290 from @AngularClass';
    expect(subject).toEqual(result);
  });

  it('should have DickonStudy in the page', () => {
    let subject = element(by.id('zones')).getText();
    let result  = 'DICKONSTUDY';
    expect(subject).toContain(result);
  });

});
