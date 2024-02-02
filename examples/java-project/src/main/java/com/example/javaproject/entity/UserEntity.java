package com.example.javaproject.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "`user`")
public class UserEntity {
    @Id
    @GeneratedValue
    @Column(name = "`id`")
    private Long id;

    @Column(name = "`username`", nullable = false)
    private String username;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
