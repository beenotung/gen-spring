package com.example.javaproject.service;

import com.example.javaproject.dto.user.*;
import com.example.javaproject.entity.UserEntity;
import com.example.javaproject.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class UserServiceImpl implements UserService {
    @Autowired
    UserRepository userRepository;

    @Override
    public GetUsersResponseDTO getUsers(GetUsersRequestDTO getUsersRequestDTO) {
        GetUsersResponseDTO result = new GetUsersResponseDTO();
        result.users = userRepository.findAll();
        return result;
    }

    @Override
    public GetUserProfileByIdResponseDTO getUserProfileById(Long id, GetUserProfileByIdRequestDTO getUserProfileByIdRequestDTO) {
        GetUserProfileByIdResponseDTO result = new GetUserProfileByIdResponseDTO();
        result.user = userRepository.findById(id).orElseThrow();
        return result;
    }

    @Override
    public PostUserLoginResponseDTO postUserLogin(PostUserLoginRequestDTO postUserLoginRequestDTO) {
        return null;
    }

    @Override
    public PostUserRegisterResponseDTO postUserRegister(PostUserRegisterRequestDTO postUserRegisterRequestDTO) {
        UserEntity row = new UserEntity();
        row.setUsername(postUserRegisterRequestDTO.username);
        row = userRepository.save(row);

        PostUserRegisterResponseDTO result = new PostUserRegisterResponseDTO();
        result.id = row.getId();
        return result;
    }
}
