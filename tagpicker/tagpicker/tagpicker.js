
angular.module('components.tagpicker')
  .directive('tagPicker', function () {
    return {
      scope: {
        pickedTags: '=',
        tags: '=',
        onlyOne: '@'
      },
      restrict: 'AE',
      replace: true,
      templateUrl: 'components/tagpicker/tagpicker.html',
      controller: function ($scope, bestOrderFilter, $http, $log) {
        var availableTags = [],
            pickedKeys = {},
            keyCodes = {
              ENTER: 13,
              DOWN: 40,
              UP: 38,
              BACKSPACE: 8
            };

        $scope.hits = [];
        $scope.selectedIndex = null;
        $scope.doFocus = false;

        $scope.$watch('tag', updateFilter);
        $scope.$watch('tags', updateTags);

        $scope.focusInput = function () {
          $scope.doFocus = true;
        };

        $scope.tagKeyPress = function ($event) {
          if ($event.which === keyCodes.ENTER) {
            addTag();
          } else if ($event.which === keyCodes.DOWN) {
            updateSelectedIndex(1);
            $event.preventDefault();
          } else if ($event.which === keyCodes.UP) {
            updateSelectedIndex(-1);
            $event.preventDefault();
          } else if ($event.which === keyCodes.BACKSPACE && !$scope.tag) {
            unpickLastTag();
          }
        };

        $scope.unpick = function ($event) {
          unpickTagByIndex(this.$index);
          $event.stopPropagation();
        };

        $scope.selectThisItem = function () {
          $scope.selectedIndex = this.$index;
        };

        $scope.addSelectedTag = function () {
          addTag();
          $scope.doFocus = false;
        };

        function markExistingTagsAsPicked () {
          if ($scope.pickedTags.length) {
            for (var i = 0; i < availableTags.length; i++) {
              for (var j = 0; j < $scope.pickedTags.length; j++) {
                if (pickedKeys[$scope.pickedTags[j].$$hashKey]) {
                  continue;
                }

                if (angular.equals($scope.pickedTags[j], availableTags[i])) {
                  availableTags.splice(i, 1, $scope.pickedTags[j]);
                  pickedKeys[$scope.pickedTags[j].$$hashKey] = true;
                }
              }
            }
          }
        }

        function unpickLastTag () {
          unpickTagByIndex($scope.pickedTags.length - 1);
        }

        function unpickTagByIndex (index) {
          var tag = $scope.pickedTags[index];
          if (tag) {
            pickedKeys[tag.$$hashKey] = false;
            $scope.pickedTags.splice(index, 1);
          }
        }

        function updateFilter (val) {
          $scope.hits = bestOrderFilter(availableTags, val, function (item) {
            return !pickedKeys[item.$$hashKey];
          });
          updateSelectedIndex();
        }

        function updateTags(newTags){
          if(!newTags){
            return;
          }
          availableTags = newTags;
          markExistingTagsAsPicked();
        }

        function addTag() {
          var hit = $scope.hits[$scope.selectedIndex];
          if ($scope.tag && hit) {
            if($scope.onlyOne){
              unpickLastTag();
            }
            pickedKeys[hit.$$hashKey] = true;
            $scope.pickedTags.push(hit);
            if ($scope.tag !== null) {
              $scope.tag = null;
            } else {
              updateFilter();
            }
          }
        }

        function updateSelectedIndex (toAdd) {
          if (typeof toAdd !== 'number') {
            toAdd = 0;
          }
          var newIndex = $scope.selectedIndex + toAdd;
          if (!newIndex || newIndex < 0) {
            newIndex = 0;
          } else if (newIndex >= $scope.hits.length) {
            newIndex = $scope.hits.length - 1;
          }
          $scope.selectedIndex = newIndex;
        }
      }
    };
  });
