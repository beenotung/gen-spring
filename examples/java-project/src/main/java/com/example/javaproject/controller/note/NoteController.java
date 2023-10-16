package com.example.javaproject.controller.note;

import com.example.javaproject.dto.note.*;
import com.example.javaproject.service.NoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("notes")
public class NoteController {
  @Autowired
  NoteService noteService;

  // GET /notes
  @GetMapping
  public GetNotesResponseDTO getNotes(GetNotesRequestDTO getNotesRequestDTO) {
    // to add validation logic
    return noteService.getNotes(getNotesRequestDTO);
  }

  // GET /notes/:id
  @GetMapping("{id}")
  public GetNoteByIdResponseDTO getNoteById(@PathVariable Long id, GetNoteByIdRequestDTO getNoteByIdRequestDTO) {
    // to add validation logic
    return noteService.getNoteById(id, getNoteByIdRequestDTO);
  }

  // POST /notes
  @PostMapping
  public PostNoteResponseDTO postNote(@RequestBody PostNoteRequestDTO postNoteRequestDTO) {
    // to add validation logic
    return noteService.postNote(postNoteRequestDTO);
  }

  // DELETE /notes/:id
  @DeleteMapping("{id}")
  public DeleteNoteByIdResponseDTO deleteNoteById(@PathVariable Long id, DeleteNoteByIdRequestDTO deleteNoteByIdRequestDTO) {
    // to add validation logic
    return noteService.deleteNoteById(id, deleteNoteByIdRequestDTO);
  }

  // PATCH /notes/:id
  @PatchMapping("{id}")
  public PatchNoteByIdResponseDTO patchNoteById(@PathVariable Long id, @RequestBody PatchNoteByIdRequestDTO patchNoteByIdRequestDTO) {
    // to add validation logic
    return noteService.patchNoteById(id, patchNoteByIdRequestDTO);
  }
}
