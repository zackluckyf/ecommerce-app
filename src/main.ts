import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.browser.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
  // cli doesn't have option to not have logs in production...
  // window.console.log = function(){};
}

export function main() {
  return platformBrowserDynamic().bootstrapModule(AppModule);
}

if (document.readyState === 'complete') {
  main();
} else {
  document.addEventListener('DOMContentLoaded', main);
}

if (module['hot']) {
  console.log('calling module.hot.accept()');
  module['hot'].accept();
}
