
angular.module('components.arrayfilters')
    .filter('bestOrder', function () {
        return function (arr, search, filter, limit) {
            if (!search || search.trim().length === 0) {
                return [];
            }

            var r1 = new RegExp('^' + search, 'i');
            var r2 = new RegExp(search, 'ig');
            var res = [];

            function getPoint (item) {
                if (!search) {
                    return item.value;
                }

                if (search === item.value) {
                    return 100;
                }

                var m = null,
                    p = 0;

                if (m = item.value.match(r1)) {
                    p += (search.length / item.value.length) * 100;
                }
                if (m = item.value.match(r2)) {
                    p += m.length;
                }

                return p;
            }

            arr.forEach(function (item) {
                var points = getPoint(item);

                if (filter) {
                    if (typeof filter === 'function') {
                        if (!filter(item)) {
                            return;
                        }
                    } else {
                        for (var key in filter) {
                            if (filter.hasOwnProperty(key) && filter[key] !== item[key] && !(filter[key] === null && typeof item[key] === 'undefined')) {
                                return;
                            }
                        }
                    }
                }

                if (points) {
                    res.push({
                        item: item,
                        points: points
                    });
                }
            });

            res.sort(function (a, b) {
                return b.points - a.points;
            });

            return res.slice(0, limit || 5).map(function (a) { return a.item; });
        };
    });
