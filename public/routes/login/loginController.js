var module = angular.module('myapp');

module.controller("LoginController", function (UserService, $location, $route) {
    var vm = this;

    vm.loggedIn = UserService.loggedIn;

    function login(username, password) {
        console.log('logging in: ' + username + ' ' + password);

        UserService.login(username, password).then(function (response) {
            if (response.data) {
                vm.loggedIn = true;
                vm.username = username;
                console.log("logged in!");
                $location.path("/");
                $route.reload();
            } else {
                console.log("wrong user/password!");
                vm.wrongPassword = true;
            }
        });
    }

    function logout() {
        console.log('logging out');
        UserService.logout().then(function () {
            vm.loggedIn = false;
            $location.path("/");
            $route.reload();
        });
    }

    function loggedIn() {
        return vm.loggedIn;
    }

    function wrongPassword() {
        return vm.wrongPassword;
    }

    function username() {
        return vm.username;
    }

    return {
        login: login,
        loggedIn: loggedIn,
        wrongPassword: wrongPassword,
        logout: logout,
        username: username
    }

});