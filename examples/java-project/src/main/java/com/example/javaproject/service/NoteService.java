package com.example.javaproject.service;

import com.example.javaproject.dto.note.*;

public interface NoteService {
    GetNotesResponseDTO getNotes(GetNotesRequestDTO requestDTO);

    GetNoteByIdResponseDTO getNoteById(Long id, GetNoteByIdRequestDTO requestDTO);

    PostNoteResponseDTO postNote(PostNoteRequestDTO requestDTO);

    DeleteNoteByIdResponseDTO deleteNoteById(Long id, DeleteNoteByIdRequestDTO requestDTO);

    PatchNoteByIdResponseDTO patchNoteById(Long id, PatchNoteByIdRequestDTO requestDTO);
}
