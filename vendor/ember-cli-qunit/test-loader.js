/* globals jQuery,QUnit */

jQuery(document).ready(function() {
  var TestLoader = require('ember-cli/test-loader')['default'];
  var urlParams = QUnit.urlParams;
  var moduleFilter;
  if (urlParams.module_filter) {
    moduleFilter = new RegExp(decodeURIComponent(urlParams.module_filter));
  }
  if (urlParams.time) {
    timekeeper.travel(parseFloat(urlParams.time));
  }
  TestLoader.prototype.shouldLoadModule = function(moduleName) {
    if (moduleFilter) {
      return moduleFilter.test(moduleName) && (/[-_]test$/.test(moduleName) ||
            (!urlParams.nojshint && /\.jshint$/.test(moduleName)));
    }
    else {
      return /[-_]test$/.test(moduleName) || (!urlParams.nojshint && /\.jshint$/.test(moduleName));
    }
  };

  TestLoader.prototype.moduleLoadFailure = function(moduleName, error) {
    QUnit.module('TestLoader Failures');
    QUnit.test(moduleName + ': could not be loaded', function() {
      throw error;
    });
  };

  setTimeout(function() {
    TestLoader.load();
    QUnit.start();
  }, 250);
});
