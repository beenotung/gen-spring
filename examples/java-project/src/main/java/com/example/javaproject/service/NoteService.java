package com.example.javaproject.service;

import com.example.javaproject.dto.note.*;

public interface NoteService {
    GetNotesResponseDTO getNotes(GetNotesRequestDTO getNotesRequestDTO);

    GetNoteByIdResponseDTO getNoteById(Long id, GetNoteByIdRequestDTO getNoteByIdRequestDTO);

    PostNoteResponseDTO postNote(PostNoteRequestDTO postNoteRequestDTO);

    DeleteNoteByIdResponseDTO deleteNoteById(Long id, DeleteNoteByIdRequestDTO deleteNoteByIdRequestDTO);

    PatchNoteByIdResponseDTO patchNoteById(Long id, PatchNoteByIdRequestDTO patchNoteByIdRequestDTO);
}
