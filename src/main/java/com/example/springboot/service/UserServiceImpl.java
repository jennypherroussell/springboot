package com.example.springboot.service;

import java.util.List;
import com.example.springboot.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.CriteriaDefinition;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service("userService")
@Transactional
public class UserServiceImpl implements UserService{

	@Autowired
	private com.example.springboot.repositories.UserDao userRepository;

	@Autowired
	MongoOperations mongoOperations;
	
	public User findById(String id) {
		return userRepository.findOne(id);
	}

	public void saveUser(User user) {
		userRepository.save(user);
	}

	public void updateUser(User user){
		saveUser(user);
	}

	public void deleteUser(User user){
		userRepository.delete(user.getId());
	}
	
	public void deleteUserById(String id){
		userRepository.delete(id);
	}

	public void deleteAllUsers(){
		userRepository.deleteAll();
	}

	public List<User> findAllUsers(){
		return userRepository.findAll();
	}

	public List<User> findByName(User user){
		
		Query query = new Query();
		if(!user.getNombre().isEmpty())
		{
			query.addCriteria(Criteria.where("nombre").is(user.getNombre()));
		}
		if(!user.getApellido_paterno().isEmpty())
		{
			query.addCriteria(Criteria.where("apellido_paterno").is(user.getApellido_paterno()));
		}
		if(!user.getApellido_materno().isEmpty())
		{
			query.addCriteria(Criteria.where("apellido_materno").is(user.getApellido_materno()));
		}
		return mongoOperations.find(query, User.class);
	}



}
