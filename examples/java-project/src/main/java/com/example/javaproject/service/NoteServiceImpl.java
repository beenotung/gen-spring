package com.example.javaproject.service;

import com.example.javaproject.dto.note.*;
import org.springframework.stereotype.Service;

@Service
public class NoteServiceImpl implements NoteService {
    @Override
    public GetNotesResponseDTO getNotes(GetNotesRequestDTO getNotesRequestDTO) {
        GetNotesResponseDTO result = new GetNotesResponseDTO();
        return result;
    }

    @Override
    public GetNoteByIdResponseDTO getNoteById(Long id, GetNoteByIdRequestDTO getNoteByIdRequestDTO) {
        return null;
    }

    @Override
    public PostNoteResponseDTO postNote(PostNoteRequestDTO postNoteRequestDTO) {
        return null;
    }

    @Override
    public DeleteNoteByIdResponseDTO deleteNoteById(Long id, DeleteNoteByIdRequestDTO deleteNoteByIdRequestDTO) {
        return null;
    }

    @Override
    public PatchNoteByIdResponseDTO patchNoteById(Long id, PatchNoteByIdRequestDTO patchNoteByIdRequestDTO) {
        return null;
    }
}
