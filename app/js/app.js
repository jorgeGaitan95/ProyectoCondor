var app = angular.module('app', ['ngMaterial', 'ngMdIcons', 'ui.router','started.directives','started.services','started.controllers','ngAnimate', 'angular-carousel','mdPickers','ngMdIcons','ngFileUpload','ngImgCrop']);

app.run(function(pouchDBFactory,dataTimeline) {
  pouchDBFactory.initRemote('https://robinsonuq:robinson123456@robinsonuq.cloudant.com/prueba');
  dataTimeline.initTimeline('timelineuserprueba');
})
app.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('timeline', {
      url: '/timeline',
      views: {
        'menuContent': {
          templateUrl: 'templates/editor.html',
          controller:'timelineCtrl'
        }
      }
    });
  $urlRouterProvider.otherwise('/timeline');
});
