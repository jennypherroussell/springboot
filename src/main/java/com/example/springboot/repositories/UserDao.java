package com.example.springboot.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.example.springboot.model.User;




public interface UserDao extends MongoRepository<User, String> {

	 @Query("{ '_id' : ?0 }")
	    User findById(String _id);
	 public void delete(String id);
}
