'use strict';

angular.module('santanderApp').controller('UserController',
    ['UserService', '$scope',  function( UserService, $scope) {

        var self = this;
        self.user = {};
        self.users=[];

        self.submit = submit;
        self.getAllUsers = getAllUsers;
        self.createUser = createUser;
        self.updateUser = updateUser;
        self.removeUser = removeUser;
        self.editUser = editUser;
        self.reset = reset;
        self.buscar = buscar;

        self.successMessage = '';
        self.errorMessage = '';
        self.done = false;

        self.onlyIntegers = /^\d+$/;
        self.onlyNumbers = /^\d+([,.]\d+)?$/;
        
        $scope.clear = function () {
          $scope.fecha_nacimiento = null;
        };

      
        
        $scope.status = {
        	    opened: false
        	}
        
        $scope.open2 = function() {
            $scope.opened = true;
          };

          
        // open min-cal
        $scope.openxxx = function($event) {
        
          $scope.opened = true;
        };
        
        $scope.open = function($event) {
            $scope.status.opened = true;
          };
          
        
          $scope.format = 'dd/MM/yyyy';
        
        

        function submit() {
          
            if (self.user.id === undefined || self.user.id === null) {
               
                createUser(self.user);
            } else {
                updateUser(self.user, self.user.id);
               
            }
        }
        
        $scope.RejectEnter = function() {
        
          document.getElementById("btnCal").focus();
          document.getElementById("btnCal").click();
          return false;
          };

        function createUser(user) {
           
            UserService.createUser(user)
                .then(
                    function (response) {
                        
                        self.successMessage = 'Usuario creado';
                        self.errorMessage='';
                        self.done = true;
                        self.user={};
                        $scope.myForm.$setPristine();
                    },
                    function (errResponse) {
                       
                        self.errorMessage = 'Error al guardar Usuario: ' + errResponse.data.errorMessage;
                        self.successMessage='';
                    }
                );
        }


        function updateUser(user, id){
           
            UserService.updateUser(user, id)
                .then(
                    function (response){
                       
                        self.successMessage='User updated successfully';
                        self.errorMessage='';
                        self.done = true;
                        $scope.myForm.$setPristine();
                    },
                    function(errResponse){
                       
                        self.errorMessage='Error while updating User '+errResponse.data;
                        self.successMessage='';
                    }
                );
        }


        function removeUser(id){
            
            UserService.removeUser(id)
                .then(
                    function(){
                        console.log('User '+id + ' removed successfully');
                    },
                    function(errResponse){
                        console.error('Error while removing user '+id +', Error :'+errResponse.data);
                    }
                );
        }


        function getAllUsers(){
            return UserService.getAllUsers();
        }

        function buscar(){
        	
        	getAllUsers();
        }
        
        function editUser(id) {
            self.successMessage='';
            self.errorMessage='';
            UserService.getUser(id).then(
                function (user) {
                    self.user = user;
                },
                function (errResponse) {
                    console.error('Error while removing user ' + id + ', Error :' + errResponse.data);
                }
            );
        }
        function reset(){
            self.successMessage='';
            self.errorMessage='';
            self.user={};
            $scope.myForm.$setPristine(); //reset Form
        }
    }


    ]);