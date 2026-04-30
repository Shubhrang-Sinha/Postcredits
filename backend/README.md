# Postcredits Backend

```
npm install
npm run dev
```

```
open http://localhost:3000
```

## Database Schema

```mermaid
erDiagram
    USERS {
        int user_id PK
        string email UK
        string password_hash
        string display_name
        enum role
        timestamp created_at
        timestamp updated_at
    }
    CREATORS {
        int creator_id PK
        string name
        enum creator_type
        timestamp created_at
    }
    WORKS {
        int work_id PK
        string title
        enum work_type
        int release_year
        timestamp created_at
    }
    BOOKS {
        int book_id PK
        int work_id FK UK
        int author_id FK
        int pages
        timestamp created_at
    }
    MOVIES {
        int movie_id PK
        int work_id FK UK
        int director_id FK
        int duration
        timestamp created_at
    }
    GENRES {
        int genre_id PK
        string name UK
    }
    WORK_GENRES {
        int work_id FK
        int genre_id FK
    }
    RATINGS {
        int rating_id PK
        int user_id FK
        int work_id FK
        int score
        timestamp created_at
        timestamp updated_at
    }

    USERS ||--o{ RATINGS : rates
    CREATORS ||--o{ BOOKS : authors
    CREATORS ||--o{ MOVIES : directs
    WORKS ||--o{ BOOKS : book_type
    WORKS ||--o{ MOVIES : movie_type
    WORKS ||--o{ WORK_GENRES : categorized
    WORKS ||--o{ RATINGS : rated
    GENRES ||--o{ WORK_GENRES : applied_to
```

### Table Descriptions

- **users**: Registered users with email, password hash, display name, and role (user/admin)
- **creators**: Authors and directors with name and type
- **works**: Unified media entity with title, type (book/movie), and release year
- **books**: Book-specific data (author, pages) linked to works
- **movies**: Movie-specific data (director, duration) linked to works
- **genres**: Genre names for categorizing works
- **work_genres**: Junction table linking works to genres (many-to-many)
- **ratings**: User ratings for works (1-5 score)
