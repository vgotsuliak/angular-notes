var module = angular.module('myapp');

module.controller('NotesController', NotesController);

function NotesController($http, $routeParams, $location) {
    var vm = this;
    this.notes = [];
    vm.activeSection = $routeParams.section;
    vm.sections = [];

    function updateNotes() {
        var params = {section: vm.activeSection};
        console.log('updating notes: ' + params.section);
        $http.get("/notes", {params: params})
            .success(function (notes) {
                vm.notes = notes;
            });
    }

    function add(text) {
        if (!text || text.length == 0) {
            return;
        }
        var note = {text: text, section: vm.activeSection};
        $http.post("/notes", note)
            .success(function () {
                updateNotes();
            });
    }

    function remove(id) {
        $http.delete("/notes", {params: {id: id}}).success(updateNotes());
    }

    function updateSections() {
        $http.get("/sections").then(function (response) {
            vm.sections = response.data;
            if (vm.activeSection == null && vm.sections.length > 0) {
                vm.activeSection = vm.sections[0].title;
            }
        });
    }

    function showSection(section) {
        vm.activeSection = section.title;
        $location.path(section.title);
    }

    function notes() {
        return vm.notes;
    }

    function sections() {
        return vm.sections;
    }

    function activeSection() {
        return vm.activeSection;
    }

    function writeSections() {
        if (vm.sections && vm.sections.length > 0) {
            console.log('sending new section');
            $http.post("/sections/replace", vm.sections);
        }
    }

    function addSection(newSection) {
        console.log('Adding new section: ' + newSection);
        if (newSection.length == 0) return;
        // check for duplicates
        for (var i = 0; i < vm.sections.length; i++) {
            if (vm.sections[i].title == newSection) {
                console.log('duplicate section');
                return;
            }
        }
        var section = {title: newSection};
        vm.sections.push(section);
        vm.activeSection = newSection;
        writeSections();
        updateNotes();
    }

    updateSections();
    updateNotes();

    return {
        add: add,
        notes: notes,
        remove: remove,
        sections: sections,
        showSection: showSection,
        activeSection: activeSection,
        addSection: addSection,
        writeSections: writeSections
    };

}