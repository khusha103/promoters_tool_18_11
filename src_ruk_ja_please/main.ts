import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { environment } from './environments/environment';

import { AppModule } from './app/app.module';

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));



if (!environment.production) {
  // Override all console methods in development mode
  console.log = function() {};
  console.debug = function() {};
  console.info = function() {};
  console.warn = function() {};
  console.error = function() {};
}
