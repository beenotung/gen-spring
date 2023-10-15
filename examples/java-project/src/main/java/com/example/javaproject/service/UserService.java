package com.example.javaproject.service;

import com.example.javaproject.dto.user.*;

public interface UserService {
  GetUsersResponseDTO getUsers(GetUsersRequestDTO getUsersRequestDTO);

  GetUserProfileByIdResponseDTO getUserProfileById(Long id, GetUserProfileByIdRequestDTO getUserProfileByIdRequestDTO);

  PostUserLoginResponseDTO postUserLogin(PostUserLoginRequestDTO postUserLoginRequestDTO);

  PostUserRegisterResponseDTO postUserRegister(PostUserRegisterRequestDTO postUserRegisterRequestDTO);
}
