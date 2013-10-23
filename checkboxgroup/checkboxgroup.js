angular.module('components.checkboxgroup')
  .directive('cbGroup', function () {
    return {
      scope: {
        selected: '=',
        source: '=',
        onlyOne: '@'
      },
      restrict: 'AE',
      replace: true,
      templateUrl: 'components/checkboxgroup/checkboxgroup.html',
      controller: function ($scope) {
        
        var dragging = false;
        initElements();

        /**
         *Watch for external changes of source/selected
        */
        $scope.$watch('source', updateSource, true);
        $scope.$watch('selected', updateSelected, true);

        /**
         *Drag to select support
         */
        $scope.startDrag = function(event){
          if(event.button === 0){
            event.preventDefault();
            dragging = true;
          }
        };

        $scope.stopDrag = function(event){
          dragging = false;
        };

        $scope.toggleIfDrag = function(element, event){
          event.preventDefault();
          if(dragging){
            $scope.toggle(element, event);
          }
        };

        /**
         *toggle selection
         */
        $scope.toggle = function(element, event){
          if(event.button === 0){
            update(element, !element.selected);
          }
        };

        $scope.change = function(element){
          update(element, element.selected);
        };

        function update(element, bool){
          if(bool){
            return add(element);
          }
          remove(element);
        }

        function add(element){
          if($scope.onlyOne){
            clear();
          }
          $scope.selected.push($scope.source[element.index]);
        }

        function remove(element){
          $scope.selected.splice(inSelection(element), 1);
        }

        function clear(){
          $scope.selected.splice(0, $scope.selected.length);
        }
        /**
         * element ids
        */
        function inSelection(element){
          for (var i = 0; i < $scope.selected.length; i++) {
            if(element.value === $scope.selected[i].value){
              return i;
            }
          }
          return false;
        }

        function inSource(element){
          for (var i = 0; i < $scope.source.length; i++) {
            if(element.value === $scope.source[i].value){
              return i;
            }
          }
          return false;
        }

        /**
        * Setup and watches
        */
        function initElements(){
          $scope.elements = [];
          if(!$scope.source){
            return;
          }
          $scope.source.forEach(function(e, i){
            $scope.elements[i] = {};
            angular.copy(e, $scope.elements[i]);
            $scope.elements[i].index = i;
          });
        }

        function updateSelected(){
          $scope.elements.forEach(function(e, i){
            if(inSelection(e) !== false){
              return $scope.elements[i].selected = true;
            }
            $scope.elements[i].selected = false;
          });
        }
        
        function updateSource(){
          initElements();
          clearNonExistingSelected();
        }

        function clearNonExistingSelected(){
          if($scope.selected){
            for (var i = 0; i < $scope.selected.length; i++) {
              if(inSource($scope.selected[i]) !== false){
                $scope.selected.splice(i,1);
              }
            }
          }
        }

      }
    };
  });
