'use strict';

angular.module('santanderApp').directive("ngFileSelect",function(){

	  return {
	    link: function($scope,el){
	      
	      el.bind("change", function(e){
	      
	        $scope.file = (e.srcElement || e.target).files[0];
	        $scope.getFile();
	      })
	      
	    }
	    
	  }
	    
	}).controller('UserController',
    ['UserService','$scope', '$http', '$timeout', '$compile', 'Upload' , function( UserService, $scope, $http, $timeout, $compile, Upload,fileReader) {
    	var version = '11.1.3';
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
        
        self.userFilter = {};
        $scope.namefilter=namefilter;
        $scope.paternofilter=paternofilter;
        $scope.maternofilter=maternofilter;
        self.setFoto = setFoto;
        self.readAsDataURL=readAsDataURL;
       
        self.onlyIntegers = /^\d+$/;
        self.onlyNumbers = /^\d+([,.]\d+)?$/;
        
        $scope.clear = function () {
          $scope.fecha_nacimiento = null;
        };
        
        self.toBase64=toBase64;
        
        ////////////////777
        
        

            var service = {
                abbreviate: abbreviate,
                byteSize: byteSize,
                openFile: openFile,
                toBase64: toBase64
            };

         

            function abbreviate (text) {
                if (!angular.isString(text)) {
                    return '';
                }
                if (text.length < 30) {
                    return text;
                }
                return text ? (text.substring(0, 15) + '...' + text.slice(-10)) : '';
            }

            function byteSize (base64String) {
                if (!angular.isString(base64String)) {
                    return '';
                }

                function endsWith(suffix, str) {
                    return str.indexOf(suffix, str.length - suffix.length) !== -1;
                }

                function paddingSize(base64String) {
                    if (endsWith('==', base64String)) {
                        return 2;
                    }
                    if (endsWith('=', base64String)) {
                        return 1;
                    }
                    return 0;
                }

                function size(base64String) {
                    return base64String.length / 4 * 3 - paddingSize(base64String);
                }

                function formatAsBytes(size) {
                    return size.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' bytes';
                }

                return formatAsBytes(size(base64String));
            }

            function openFile (type, data) {
                $window.open('data:' + type + ';base64,' + data, '_blank', 'height=300,width=400');
            }

            function toBase64 (file, cb) {
                var fileReader = new FileReader();
                fileReader.readAsDataURL(file);
                fileReader.onload = function (e) {
                    var base64Data = e.target.result.substr(e.target.result.indexOf('base64,') + 'base64,'.length);
                    cb(base64Data);
                };
            }
       
        //////////////
        
        function readAsDataURL  (file, scope) {
            var deferred = $q.defer();
             
            var reader = getReader(deferred, scope);         
            reader.readAsDataURL(file);
             
            return deferred.promise;
        };
 
        
        $scope.getFile = function () {
            $scope.progress = 0;
            var reader = new FileReader();
        	  reader.onloadend = function() {
        		  self.user.foto=reader.result;
        		  $scope.imageSrc = reader.result;
        	
        	  }
        	  reader.readAsDataURL($scope.file);
        	  $scope.progress = progress.loaded / progress.total;
        	  toBase64($scope.file, function(base64Data) {
        		  $scope.$apply(function() {
                	  self.user.foto = base64Data;
                      self.userContentType ='image/jpeg';
                  });
              });
        };
     
        $scope.$on("fileProgress", function(e, progress) {
        	alert("bajo la lluvias");
            $scope.progress = progress.loaded / progress.total;
        });
        
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
            }
             else {
                updateUser(self.user, self.user.id);
               
            }
        }
        
        $scope.RejectEnter = function() {
        
          document.getElementById("btnCal").focus();
          document.getElementById("btnCal").click();
          return false;
          };
          
          
          function setFoto($file, user) {
        	  alert("hg");
              if ($file && $file.$error === 'pattern') {
                  return;
              }
              if ($file) {
                  DataUtils.toBase64($file, function(base64Data) {
                      $scope.$apply(function() {
                          user.foto = base64Data;
                          user.fotoContentType = $file.type;
                      });
                  });
              }
          }


       
        function createUser(user) {
           	user.fotoContentType = 'image/jpeg';
        	console.log(user.foto);
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
                       
                        self.successMessage='Se actualizo el usuario correctamente';
                        self.errorMessage='';
                        self.done = true;
                        $scope.myForm.$setPristine();
                    },
                    function(errResponse){
                       
                        self.errorMessage='Error al actualizar Usuario '+errResponse.data;
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

        function buscar(user){
        	
        	 $scope.userFilter = { 
        			 nombre :$scope.namefilter.value
        			 ,apellidoPaterno:$scope.paternofilter.value
        			 ,apellidoMaterno:$scope.maternofilter.value };
        	
        	 UserService.loadAllUsersByFilter($scope.userFilter)
             .then(
                 function (response) {
                     
                     self.successMessage = 'Lista de Usuarios por filtro';
                     self.errorMessage='';
                     self.done = true;
                     self.user={};
                     $scope.myForm.$setPristine();
                 },
                 function (errResponse) {
                    
                     self.errorMessage = 'Error al cargar Usuarios: ' + errResponse.data.errorMessage;
                     self.successMessage='';
                 }
             );
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
       ////////////77
       
        ////////////7
       
    }


    ]);
