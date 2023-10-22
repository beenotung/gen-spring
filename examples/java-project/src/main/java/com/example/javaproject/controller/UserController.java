package com.example.javaproject.controller;

import com.example.javaproject.dto.user.*;
import com.example.javaproject.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import static com.example.javaproject.validator.ValidatorUtils.assertNoNull;

@RestController
@RequestMapping("users")
public class UserController {
    @Autowired
    UserService userService;

    // GET /users
    @GetMapping
    public GetUsersResponseDTO getUsers(GetUsersRequestDTO getUsersRequestDTO) {
        // to add validation logic
        return userService.getUsers(getUsersRequestDTO);
    }

    // GET /users/:id/profile
    @GetMapping("{id}/profile")
    public GetUserProfileByIdResponseDTO getUserProfileById(@PathVariable Long id, GetUserProfileByIdRequestDTO getUserProfileByIdRequestDTO) {
        // to add validation logic
        return userService.getUserProfileById(id, getUserProfileByIdRequestDTO);
    }

    // POST /users/login
    @PostMapping("login")
    public PostUserLoginResponseDTO postUserLogin(@RequestBody PostUserLoginRequestDTO postUserLoginRequestDTO) {
        // to add validation logic
        return userService.postUserLogin(postUserLoginRequestDTO);
    }

    // POST /users/register
    @PostMapping("register")
    public PostUserRegisterResponseDTO postUserRegister(@RequestBody PostUserRegisterRequestDTO postUserRegisterRequestDTO) {
        // to add validation logic
        assertNoNull(postUserRegisterRequestDTO, "req.body");
        return userService.postUserRegister(postUserRegisterRequestDTO);
    }
}
