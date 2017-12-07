'use strict'

angular.module('myApp.controller', [])
angular.module('myApp.controller.newfeed', [])
angular.module('myApp.controller.profile', [])
angular.module('myApp.controller.test', [])
angular.module('myApp.directiveNewsFeed', [])
angular.module('myApp.service', [])
angular.module('myApp.directive', [])

angular.module('myApp', [
    'myApp.controller',
    'myApp.controller.newfeed',
    'myApp.controller.profile',
    'myApp.service',
    'myApp.directive',
    'myApp.directiveNewsFeed',
    'myApp.controller.test'
])
