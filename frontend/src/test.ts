// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { getTestBed } from '@angular/core/testing';

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting(), {
  // with angular v13 teardown is enabled by default
  // since there are no tests for this app we could enable this for new tests
  teardown: { destroyAfterEach: false },
});
