angular.module('components.paginator')
  .directive('pag', function () {
    return {
      scope: {
        totalCount: '=',
        page: '='
      },
      restrict: 'AE',
      replace: true,
      templateUrl: 'components/paginator/paginator.html',
      controller: function ($scope) {
        
      	$scope.$watch('totalCount', function(newVal){
      		$scope.pages = getPagingPages();
      	},true);

      	$scope.$watch('page', function(newVal){
      		$scope.pages = getPagingPages();
      	},true);

        $scope.getNumberOfPages = function () {
          return Math.ceil($scope.totalCount / 20);
        };

        $scope.hasPrevPage = function () {
          return $scope.page > 1;
        };

        $scope.hasNextPage = function () {
          return $scope.page < $scope.getNumberOfPages();
        };

        $scope.nextPage = function () {
          if ($scope.hasNextPage()) {
            $scope.page += 1;
          }
        };

        $scope.lastPage = function () {
          if ($scope.hasNextPage()) {
            $scope.page = $scope.getNumberOfPages();
          }
        };

        $scope.prevPage = function () {
          if ($scope.hasPrevPage()) {
            $scope.page -= 1;
          }
        };

        $scope.firstPage = function () {
          if ($scope.hasPrevPage()) {
            $scope.page = 1;
          }
        };

        $scope.setPage = function(no){
        	$scope.page = no;
        }

        function getPagingPages() {
          var PAGES_TO_SHOW = 9,
              pages = [],
              from = 1,
              to = PAGES_TO_SHOW;


          if($scope.getNumberOfPages() < PAGES_TO_SHOW){
            from = 1;
            to = $scope.getNumberOfPages()
          }
          else{
            from = $scope.page - Math.floor(PAGES_TO_SHOW / 2);
            to = $scope.page + Math.floor(PAGES_TO_SHOW / 2);
          
            if(from < 1){
              to += Math.abs(from) + 1
              from = 1;
            }
            else if(to > $scope.getNumberOfPages()){
              from -= to - $scope.getNumberOfPages();
              to = $scope.getNumberOfPages();
            }
          }

          for (var i = from; i <= to; i++) {
            pages.push(i);
          };
          return pages;
        };
      }
    };
  });
