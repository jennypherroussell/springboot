package com.example.springboot.service;


import java.util.List;

import com.example.springboot.model.User;

public interface UserService {
	
	User findById(String id);

	void saveUser(User user);
	void deleteUser(User user);

	void updateUser(User user);

	void deleteAllUsers();

	List<User> findAllUsers();

}