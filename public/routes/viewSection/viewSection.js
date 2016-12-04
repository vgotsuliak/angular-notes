var module = angular.module('myapp');

module.controller("ViewSectionController", function ($http, $routeParams) {

    var vm = this;
    vm.section = $routeParams.name;
    var params = {params: {section: $routeParams.name}};

    $http.get("/notes", params).success(function (notes) {
        vm.notes = notes;
    });

    function notes() {
        return vm.notes;
    }

    function section() {
        return vm.section;
    }

    return {
        notes: notes,
        section: section
    }
});