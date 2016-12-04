var module = angular.module('myapp');

module.controller("UserFormController", function ($http, $location) {
    var vm = this;
    vm.user = {};
    
    function submitForm(user) {
        console.log(user);
        $http.post("/users", user) .success(function(data) {
            console.log("saved!");
            $location.path("/");
        });
    }

    return {
        submitForm: submitForm
    }
});

module.directive('uniqueUser', function ($http, $q) {
    var timer;
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elem, attr, ngModel) {
            ngModel.$asyncValidators.unique = function (modelValue, viewValue) {
                var value = modelValue || viewValue;
                return $http.get('/checkUser?user=' + value).then(function (response) {
                    if (!response.data) {
                        return $q.reject();
                    }
                    return true;
                });
            };
        }
    }
});