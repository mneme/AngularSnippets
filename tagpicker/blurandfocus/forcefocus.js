angular.module('components.blurandfocus')
  .directive('bafForcefocus', function () {
    return function (scope, elem, attrs) {
      scope.$watch(attrs.bafForcefocus, function (doFocus) {
        if (doFocus) {
          setTimeout(function(){
            elem[0].focus();
          }, 20);
        }
    }, true);
  };
});