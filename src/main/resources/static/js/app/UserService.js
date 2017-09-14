'use strict';

angular.module('santanderApp').factory('UserService',
    ['$localStorage', '$http', '$q', 'urls',
        function ($localStorage, $http, $q, urls) {

            var factory = {
                loadAllUsers: loadAllUsers,
                loadAllUsersByFilter:loadAllUsersByFilter,
                getAllUsers: getAllUsers,
                getUser: getUser,
                createUser: createUser,
                updateUser: updateUser,
                removeUser: removeUser
            };

            return factory;

            function loadAllUsers() {
                
                var deferred = $q.defer();
                $http.get(urls.USER_SERVICE_API)
                    .then(
                        function (response) {
                            $localStorage.users = response.data;
                            deferred.resolve(response);
                        },
                        function (errResponse) {
                          
                            deferred.reject(errResponse);
                        }
                    );
                return deferred.promise;
            }
            
            function loadAllUsersByFilter(user) {
               var deferred = $q.defer();
                $http.get(urls.USER_SERVICE_API+"filtered" ,{params: {nombre: user.nombre,apellidoPaterno:user.apellidoPaterno,apellidoMaterno:user.apellidoMaterno}})
                    .then(
                        function (response) {
                            $localStorage.users = response.data;
                            deferred.resolve(response);
                        },
                        function (errResponse) {
                          
                            deferred.reject(errResponse);
                        }
                    );
                return deferred.promise;
            }

            function getAllUsers(){
                return $localStorage.users;
            }

            function getUser(id) {
                console.log('Fetching User with id :'+id);
                var deferred = $q.defer();
                $http.get(urls.USER_SERVICE_API + id)
                    .then(
                        function (response) {
                           
                            deferred.resolve(response.data);
                        },
                        function (errResponse) {
                           
                            deferred.reject(errResponse);
                        }
                    );
                return deferred.promise;
            }

            function createUser(user) {
                 var deferred = $q.defer();
                 
                $http.post(urls.USER_SERVICE_API, user)
                    .then(
                        function (response) {
                            loadAllUsers();
                            deferred.resolve(response.data);
                        },
                        function (errResponse) {
                         
                           deferred.reject(errResponse);
                        }
                    );
                return deferred.promise;
            }

            function updateUser(user, id) {
               
                var deferred = $q.defer();
                $http.put(urls.USER_SERVICE_API + id, user)
                    .then(
                        function (response) {
                            loadAllUsers();
                            deferred.resolve(response.data);
                        },
                        function (errResponse) {
                           
                            deferred.reject(errResponse);
                        }
                    );
                return deferred.promise;
            }
            
            
            

            function removeUser(id) {
               var deferred = $q.defer();
                $http.delete(urls.USER_SERVICE_API + id)
                    .then(
                        function (response) {
                            loadAllUsers();
                            deferred.resolve(response.data);
                        },
                        function (errResponse) {
                              deferred.reject(errResponse);
                        }
                    );
                return deferred.promise;
            }

        }
    ]);