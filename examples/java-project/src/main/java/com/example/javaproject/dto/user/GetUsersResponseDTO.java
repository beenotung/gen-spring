package com.example.javaproject.dto.user;

import com.example.javaproject.entity.UserEntity;
import com.fasterxml.jackson.annotation.JsonProperty;

public class GetUsersResponseDTO {
    @JsonProperty("users")
    public Iterable<UserEntity> users;
}
