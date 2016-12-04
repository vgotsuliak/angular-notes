var module = angular.module('myapp');

module.factory("UserService", function ($http) {

        var service = {};
        service.userName = "";
        service.loggedIn = false;

        function login(login, password) {
            return $http.post("/login", {login: login, password: password});
        }

        function logout() {
            return $http.get("/logout");
        }

        return {
            login: login,
            logout: logout
        };

    }
);