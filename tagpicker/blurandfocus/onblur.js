angular.module('components.blurandfocus')
    .directive('bafOnblur', function () {
        return function (scope, elem, attrs) {
            elem.bind('blur', function () {
                scope.$apply(attrs.bafOnblur);
            });
        };
    });
