package com.example.javaproject.dto.user;

import com.fasterxml.jackson.annotation.JsonProperty;

public class PostUserRegisterRequestDTO {
    @JsonProperty("username")
    public String username;

    @JsonProperty("district_id")
    public Long districtId;
}
