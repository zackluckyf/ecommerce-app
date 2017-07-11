import { browser, by, element } from 'protractor';

export class EcommerceAppPage {
  navigateTo() {
    return browser.get('/');
  }

  getTitle() {
    return element(by.css('app-root h1')).getText();
  }
}
