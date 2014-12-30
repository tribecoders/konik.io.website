'use strict';

/**
 * @ngdoc overview
 * @name konik.io.app
 *
 * @description
 * Application for konik.io site
 */
(function() {
  angular.module('konikio', [
    'ui.bootstrap',
    'konikio.users',
    'konikio.validation'
  ]);
})();
