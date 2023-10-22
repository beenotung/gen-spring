package com.example.javaproject.service;

import com.example.javaproject.dto.user.*;

public interface UserService {
    GetUsersResponseDTO getUsers(GetUsersRequestDTO requestDTO);

    GetUserProfileByIdResponseDTO getUserProfileById(Long id, GetUserProfileByIdRequestDTO requestDTO);

    PostUserLoginResponseDTO postUserLogin(PostUserLoginRequestDTO requestDTO);

    PostUserRegisterResponseDTO postUserRegister(PostUserRegisterRequestDTO requestDTO);
}
