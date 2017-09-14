package com.example.springboot.controller;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

import com.example.springboot.model.User;
import com.example.springboot.service.UserService;
import com.example.springboot.util.CustomErrorType;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
@RestController
@RequestMapping("/api")
@Api(value="Usuarios")
public class RestApiController {

	public static final Logger logger = LoggerFactory.getLogger(RestApiController.class);

	@Autowired
	UserService userService;

	@SuppressWarnings("unchecked")
	@ApiOperation(value = "Lista de Usuarios",response = Iterable.class)
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Se recibio la lista de forma correcta"),
            @ApiResponse(code = 401, message = "No Autorizado"),
            @ApiResponse(code = 403, message = "Prohibido"),
            @ApiResponse(code = 404, message = "El recurso no está disponible")
    }
    )
	@RequestMapping(value = "/user/", method = RequestMethod.GET)
	public ResponseEntity<List<User>> listAllUsers() {
		List<User> users = userService.findAllUsers();
	
			
		if (users.isEmpty()) {
			return new ResponseEntity(HttpStatus.NO_CONTENT);
			
		}
		return new ResponseEntity<List<User>>(users, HttpStatus.OK);
	}
	@RequestMapping(value = "/user/filtered", method = RequestMethod.GET)
	public ResponseEntity<List<User>> listAllUsersFiltered(@RequestParam(value = "nombre", required = false)   String nombre,
			@RequestParam(value = "apellidoPaterno", required = false)   String apellidoPaterno,
			@RequestParam(value = "apellidoMaterno", required = false)   String apellidoMaterno) {
		    
		    User userFilter=new User();
		    userFilter.setNombre(nombre);
		    userFilter.setApellido_paterno(apellidoPaterno);
            userFilter.setApellido_materno(apellidoMaterno);	
            
		List<User> users = userService.findByName(userFilter);
	
			
		if (users.isEmpty()) {
			return new ResponseEntity(HttpStatus.NO_CONTENT);
			
		}
		return new ResponseEntity<List<User>>(users, HttpStatus.OK);
	}
	
	


	@RequestMapping(value = "/user/{id}", method = RequestMethod.GET)
	public ResponseEntity<?> getUser(@PathVariable("id") String id) {
		logger.info("Fetching User with id {}", id);
		User user = userService.findById(id);
		if (user == null) {
			logger.error("User with id {} not found.", id);
			return new ResponseEntity(new CustomErrorType("User with id " + id 
					+ " not found"), HttpStatus.NOT_FOUND);
		}
		return new ResponseEntity<User>(user, HttpStatus.OK);
	}

	@ApiOperation(value = "Alta de Usuario")
	@RequestMapping(value = "/user/", method = RequestMethod.POST)
	public ResponseEntity<?> createUser(@RequestBody User user, UriComponentsBuilder ucBuilder) {
		logger.info("Creating User : {}", user);

	
		userService.saveUser(user);

		HttpHeaders headers = new HttpHeaders();
		headers.setLocation(ucBuilder.path("/api/user/{id}").buildAndExpand(user.getId()).toUri());
		return new ResponseEntity<String>(headers, HttpStatus.CREATED);
	}

	@ApiOperation(value = "Actualizacion de Usuario")
	@RequestMapping(value = "/user/{id}", method = RequestMethod.PUT)
	public ResponseEntity<?> updateUser(@PathVariable("id") String id, @RequestBody User user) {
		logger.info("Updating User with id {}", id);

		User currentUser = userService.findById(id);

		if (currentUser == null) {
		
			return new ResponseEntity(new CustomErrorType("Unable to upate. User with id " + id + " not found."),
					HttpStatus.NOT_FOUND);
		}

		currentUser.setNombre(user.getNombre());
		currentUser.setApellido_paterno(user.getApellido_paterno());
		currentUser.setApellido_materno(user.getApellido_materno());
		currentUser.setEdad(user.getEdad());
		currentUser.setFecha_nacimiento(user.getFecha_nacimiento());
		userService.updateUser(currentUser);
		return new ResponseEntity<User>(currentUser, HttpStatus.OK);
	}

	@ApiOperation(value = "Eliminacion de Usuario")
	@RequestMapping(value = "/user/{id}", method = RequestMethod.DELETE)
	public ResponseEntity<?> deleteUser(@PathVariable("id") String id) {
	
		User user = userService.findById(id);
		if (user == null) {
			logger.error("Unable to delete. User with id {} not found.", id);
			return new ResponseEntity(new CustomErrorType("Unable to delete. User with id " + id + " not found."),
					HttpStatus.NOT_FOUND);
		}
		userService.deleteUser(user);
		return new ResponseEntity<User>(HttpStatus.NO_CONTENT);
	}

	
	@RequestMapping(value = "/user/", method = RequestMethod.DELETE)
	public ResponseEntity<User> deleteAllUsers() {
		logger.info("Deleting All Users");

		userService.deleteAllUsers();
		return new ResponseEntity<User>(HttpStatus.NO_CONTENT);
	}

}