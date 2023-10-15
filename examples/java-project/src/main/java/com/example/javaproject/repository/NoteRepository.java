package com.example.javaproject.repository;

import com.example.javaproject.entity.NoteEntity;
import org.springframework.data.repository.CrudRepository;

public interface NoteRepository extends CrudRepository<NoteEntity, Long> {
}
