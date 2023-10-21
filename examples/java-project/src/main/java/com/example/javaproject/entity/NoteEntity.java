package com.example.javaproject.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "`note`")
public class NoteEntity {
    @Id
    @GeneratedValue
    @Column(name = "`id`")
    private Long id;

    @Column(name = "`user_id`", nullable = false)
    private Long userId;

    @Column(name = "`content`", nullable = false)
    private String content;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
