# gen-spring

Generate Spring Boot Controller, Service, DTO from API list in plain text

[![npm Package Version](https://img.shields.io/npm/v/gen-spring)](https://www.npmjs.com/package/gen-spring)

## Installation (optional)

This package can be installed as devDependencies to lock specific version and reduce startup overhead

```bash
npm i -D gen-spring
```

## Usage

`gen-spring [db] < [api-file]`

The `db` argument can be skipped if `DB_CLIENT` exists in the environment variable or in the `.env` file.

### Usage Example

```
npx -y gen-spring h2 < api.txt
```

### Example API text

```
POST /users/login
POST /notes
DELETE /notes/:id
```

This will generates `UserController` class, `NoteController` class, `UserService` interface, `NoteService` interface and corresponding methods and DTO.

Part of generate code:

**NoteController.java**:

```java
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
}

```

**NoteService.java**:

```java
package com.example.javaproject.service;

import com.example.javaproject.dto.note.*;

public interface NoteService {
  PostNoteResponseDTO postNote(PostNoteRequestDTO postNoteRequestDTO);

  DeleteNoteByIdResponseDTO deleteNoteById(Long id, DeleteNoteByIdRequestDTO deleteNoteByIdRequestDTO);
}
```

**NoteServiceImpl.java**:

```java
package com.example.javaproject.service;

import com.example.javaproject.repository.NoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NoteServiceImpl implements NoteService {
  @Autowired
  NoteRepository noteRepository;
}
```

## License

This project is licensed with [BSD-2-Clause](./LICENSE)

This is free, libre, and open-source software. It comes down to four essential freedoms [[ref]](https://seirdy.one/2021/01/27/whatsapp-and-the-domestication-of-users.html#fnref:2):

- The freedom to run the program as you wish, for any purpose
- The freedom to study how the program works, and change it so it does your computing as you wish
- The freedom to redistribute copies so you can help others
- The freedom to distribute copies of your modified versions to others
