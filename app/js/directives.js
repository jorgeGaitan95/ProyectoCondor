var directives = angular.module('started.directives', []);

directives.directive('videoTempate', ['$timeout',  function ($timeout) {
  return {
    restrict: 'E',
    scope: {
        template: '@',
        val: '@'
      },
      template:"<div id='vis{{val}}'></div>",
      link:function (scope) {
        $timeout(function(){
          console.log("vis"+scope.val);
          jwplayer("vis"+scope.val).setup({
           file: scope.template,
            width: "100%",
            height: "175",
            dash: true,
            primary: "html5"
          });
      }, 1000);
      }
  };
}]);
