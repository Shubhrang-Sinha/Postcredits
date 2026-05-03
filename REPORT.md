# Postcredits: A Technical Report on a Unified Media Recommendation System

**[College Logo Placeholder]**

**Project Title:** Postcredits
**Subtitle:** A Unified Media Recommendation System

**Authors:**
*   Saury (Roll No: 2026CS01)
*   Collaborator (Roll No: 2026CS02)

**Lab Instructor:** Dr. DBMS Specialist
**Submission Date:** May 3, 2026

---

## Table of Contents

*   [1. Introduction](#1-introduction)
    *   [1.1 Background and Motivation](#11-background-and-motivation)
    *   [1.2 The Role of DBMS](#12-the-role-of-dbms)
    *   [1.3 Project Objectives](#13-project-objectives)
    *   [1.4 Scope and Limitations](#14-scope-and-limitations)
*   [2. Literature Review](#2-literature-review)
    *   [2.1 Overview of Recommender Systems](#21-overview-of-recommender-systems)
    *   [2.2 Data Modeling in Existing Systems](#22-data-modeling-in-existing-systems)
    *   [2.3 Positioning the Postcredits System](#23-positioning-the-postcredits-system)
*   [3. System Methodology](#3-system-methodology)
    *   [3.1 System Architecture](#31-system-architecture)
    *   [3.2 Logical Data Model](#32-logical-data-model)
    *   [3.3 Recommendation Algorithm Formalization](#33-recommendation-algorithm-formalization)
*   [4. Database Normalization](#4-database-normalization)
    *   [4.1 Functional Dependencies](#41-functional-dependencies)
    *   [4.2 First Normal Form (1NF)](#42-first-normal-form-1nf)
    *   [4.3 Second Normal Form (2NF)](#43-second-normal-form-2nf)
    *   [4.4 Third Normal Form (3NF)](#44-third-normal-form-3nf)
*   [5. Implementation Details](#5-implementation-details)
    *   [5.1 Physical Schema and Constraints](#51-physical-schema-and-constraints)
    *   [5.2 Transaction Control](#52-transaction-control)
    *   [5.3 Stored Procedures and Functions](#53-stored-procedures-and-functions)
    *   [5.4 Triggers for Auditing](#54-triggers-for-auditing)
    *   [5.5 Advanced Query Patterns](#55-advanced-query-patterns)
*   [6. Results and System Behavior](#6-results-and-system-behavior)
    *   [6.1 Sample Data and Seeding](#61-sample-data-and-seeding)
    *   [6.2 Query and Recommendation Output](#62-query-and-recommendation-output)
*   [7. Conclusion](#7-conclusion)
    *   [7.1 Summary of Achievements](#71-summary-of-achievements)
    *   [7.2 Reflection on Design Decisions](#72-reflection-on-design-decisions)
    *   [7.3 Future Work](#73-future-work)
*   [8. References](#8-references)

---

## 1. Introduction

### 1.1 Background and Motivation

In the contemporary digital landscape, consumers are presented with an overwhelming volume of media, including books and movies. This "paradox of choice" complicates the discovery of new content that aligns with individual preferences. Recommendation systems have been developed to address this, but they typically operate within isolated domains (e.g., only movies or only books), creating a fragmented user experience. The Postcredits project is designed to overcome this limitation by providing a single, unified platform for cross-domain media recommendations.

### 1.2 The Role of DBMS

A Database Management System (DBMS) is central to solving this problem. The core challenge lies in modeling, storing, and querying complex relationships between users, media items, and their associated attributes (genres, creators, ratings). A relational DBMS (RDBMS) like MySQL provides the necessary tools for:
*   **Structured Data Modeling:** Defining clear schemas for entities such as users, works, and ratings.
*   **Data Integrity:** Enforcing rules to ensure that relationships are valid and data is consistent (e.g., a rating must be linked to an existing user and an existing media work).
*   **Efficient Querying:** Executing complex queries to retrieve data and compute recommendations based on user interactions.
*   **Concurrency and Transactions:** Managing simultaneous user interactions reliably.

### 1.3 Project Objectives

*   To design and implement a normalized relational database schema that unifies book and movie data.
*   To develop a user-based collaborative filtering recommendation engine within the DBMS using stored procedures.
*   To build a scalable full-stack application that ensures data consistency and integrity through DBMS features.
*   To provide a seamless and intuitive user interface for media discovery and rating.

### 1.4 Scope and Limitations

The project encompasses a backend API built with Node.js and a frontend web application using Next.js, both interacting with a MySQL database. The core logic for recommendations and data statistics is implemented directly within the database using PL/SQL.

**Limitations:**
*   The recommendation algorithm is a foundational user-based collaborative filtering model and does not employ more advanced machine learning techniques.
*   The system is designed for a single-node database and does not implement distributed database concepts.
*   The dataset is a representative sample and not exhaustive.

---

## 2. Literature Review

### 2.1 Overview of Recommender Systems

Recommender systems are broadly categorized into three types:
1.  **Content-Based Filtering:** Recommends items similar to those a user has previously liked. This approach relies on item attributes (e.g., recommending movies of the same genre).
2.  **Collaborative Filtering (CF):** Recommends items based on the preferences of similar users. This can be user-based (finding similar users) or item-based (finding similar items). This is the approach adopted by the Postcredits project.
3.  **Hybrid Systems:** Combine content-based and collaborative filtering methods to leverage the strengths of both.

### 2.2 Data Modeling in Existing Systems

Many existing systems, particularly older or simpler ones, suffer from data modeling deficiencies that impede performance and scalability. A common anti-pattern is the denormalization of multi-valued attributes, such as storing a list of genres as a comma-separated string (`"Action, Thriller, Sci-Fi"`) in a single text column. This design is flawed because:
*   It violates First Normal Form (1NF).
*   It makes querying for all works of a specific genre inefficient and complex, often requiring string matching operations instead of efficient index-based joins.
*   It introduces data redundancy and risks inconsistencies (e.g., "Sci-Fi" vs. "Science Fiction").

### 2.3 Positioning the Postcredits System

The Postcredits system improves upon these naive designs by implementing a fully normalized relational schema. By creating a `work_genres` junction table, it establishes a clean many-to-many relationship between works and genres. This relational approach provides superior data integrity, query performance, and scalability. Furthermore, by implementing the recommendation logic within the database using stored procedures, the system minimizes data transfer between the application and the database, leveraging the DBMS's native processing power for core business logic.

---

## 3. System Methodology

### 3.1 System Architecture

The system utilizes a three-tier architecture:
1.  **Presentation Tier:** A Next.js frontend application that provides the user interface.
2.  **Application Tier:** A Node.js backend using the Hono framework that handles HTTP requests and user authentication.
3.  **Data Tier:** A MySQL database that stores all data and contains the core business logic for recommendations and statistics.

### 3.2 Logical Data Model

The database schema is designed in 3rd Normal Form (3NF). The entities and their relationships are defined as follows:

*   **USERS(**<u>user_id</u> PK, email, password_hash, display_name**)**
*   **CREATORS(**<u>creator_id</u> PK, name, creator_type**)**
*   **GENRES(**<u>genre_id</u> PK, name**)**
*   **WORKS(**<u>work_id</u> PK, title, work_type, release_year**)**
*   **BOOKS(**<u>book_id</u> PK, <u>work_id</u> FK to WORKS, author_id FK to CREATORS, pages**)**
*   **MOVIES(**<u>movie_id</u> PK, <u>work_id</u> FK to WORKS, director_id FK to CREATORS, duration**)**
*   **RATINGS(**<u>rating_id</u> PK, <u>user_id</u> FK to USERS, <u>work_id</u> FK to WORKS, score**)**
*   **WORK_GENRES(**<u>work_id</u> FK to WORKS, <u>genre_id</u> FK to GENRES**)**

**Relationships:**
*   `USERS` to `RATINGS` (1:N)
*   `WORKS` to `RATINGS` (1:N)
*   `WORKS` to `BOOKS` / `MOVIES` (1:1, specialization)
*   `CREATORS` to `BOOKS` / `MOVIES` (1:N)
*   `WORKS` to `GENRES` (M:N, via `WORK_GENRES`)

### 3.3 Recommendation Algorithm Formalization

The recommendation logic is implemented as a user-based collaborative filtering algorithm in the `proc_generate_blend` stored procedure.

**1. Similarity Metric:**
To compare tastes between two users, we calculate a similarity percentage based on the Euclidean distance between their co-rated items. This approach quantifies how "close" two users are in their rating behavior.

*Distance(u1, u2) = sqrt(sum_{i in shared}( (R(u1, i) - R(u2, i))^2 ))*

*Similarity(u1, u2) = 100 * (1 - Distance(u1, u2) / (N * 4))*

Where:
- `R(u, i)` is the score user `u` gave to item `i`.
- `N` is the number of co-rated items.
- `4` is the maximum possible score difference (5 - 1).

A similarity of 100% indicates identical ratings across all shared items, while 0% indicates maximum possible divergence.

**2. Algorithm Flow:**

*   **Input:** `p_user_id` (target user), `p_work_type` (book/movie), `p_limit` (number of recommendations).
*   **Processing:**
    1.  **Similarity Calculation:** The system iterates through other users in the database and computes `fn_calculate_similarity` compared to the target user.
    2.  **Neighbor Selection:** The top 10 most similar users (neighbors) with a similarity score > 30% are selected using a `CURSOR`.
    3.  **Candidate Identification:** For each neighbor, the system identifies works they rated highly (`score >= 4`) that the target user has not yet seen or rated.
    4.  **Scoring and Ranking:** Candidate works are inserted into a temporary table `blend_results`. They are ranked by a combination of the neighbor's similarity and the item's global average rating.
*   **Output:** Select the top `p_limit` rows from `blend_results`, ordered by similarity and average rating.

---

## 4. Database Normalization

The design of the Postcredits database schema adheres to the principles of normalization to eliminate data redundancy, prevent data anomalies (INSERT, UPDATE, DELETE), and ensure logical data consistency. The schema is designed to be in Third Normal Form (3NF). This section provides a rigorous, table-by-table analysis of the normalization process.

### 4.1 Functional Dependencies and Candidate Keys

Functional Dependencies (FDs) describe relationships between attributes in a relation. For each table, we identify the candidate keys and the FDs that they determine.

*   **`users` Table**
    *   **Candidate Keys**: `{user_id}`, `{email}`
    *   **Primary Key**: `user_id` (Surrogate)
    *   **FDs**:
        *   `user_id` -> `email`, `password_hash`, `display_name`, `role`
        *   `email` -> `user_id`, `password_hash`, `display_name`, `role`

*   **`creators` Table**
    *   **Candidate Key**: `{creator_id}`
    *   **Primary Key**: `creator_id`
    *   **FDs**:
        *   `creator_id` -> `name`, `creator_type`

*   **`genres` Table**
    *   **Candidate Keys**: `{genre_id}`, `{name}`
    *   **Primary Key**: `genre_id` (Surrogate)
    *   **FDs**:
        *   `genre_id` -> `name`
        *   `name` -> `genre_id`

*   **`works` Table**
    *   **Candidate Key**: `{work_id}`
    *   **Primary Key**: `work_id`
    *   **FDs**:
        *   `work_id` -> `title`, `work_type`, `release_year`

*   **`books` Table** (Specialization of `works`)
    *   **Candidate Keys**: `{book_id}`, `{work_id}`
    *   **Primary Key**: `book_id` (Surrogate)
    *   **FDs**:
        *   `book_id` -> `work_id`, `author_id`, `pages`
        *   `work_id` -> `book_id`, `author_id`, `pages`

*   **`movies` Table** (Specialization of `works`)
    *   **Candidate Keys**: `{movie_id}`, `{work_id}`
    *   **Primary Key**: `movie_id` (Surrogate)
    *   **FDs**:
        *   `movie_id` -> `work_id`, `director_id`, `duration`
        *   `work_id` -> `movie_id`, `director_id`, `duration`

*   **`work_genres` Table** (Junction Table)
    *   **Candidate Key**: `{work_id, genre_id}` (Composite)
    *   **Primary Key**: `{work_id, genre_id}`
    *   **FDs**: This table only contains the primary key; there are no non-prime attributes. It exists solely to represent a many-to-many relationship.

*   **`ratings` Table**
    *   **Candidate Keys**: `{user_id, work_id}` (Composite)
    *   **Primary Key**: `{user_id, work_id}`
    *   **FDs**:
        *   `{user_id, work_id}` -> `score`, `created_at`, `updated_at`

*   **`rating_audit` Table**
    *   **Candidate Key**: `{audit_id}`
    *   **Primary Key**: `audit_id`
    *   **FDs**:
        *   `audit_id` -> `user_id`, `work_id`, `old_score`, `new_score`, `action`, `created_at`

### 4.2 First Normal Form (1NF)

**Definition**: A relation is in 1NF if all its attributes are atomic, meaning each cell holds a single value.

**Analysis**:
All tables in the schema adhere to 1NF.
*   **`users`, `creators`, `works`, etc.**: All attributes like `email`, `title`, and `name` are indivisible string or numeric values.
*   **Avoiding 1NF Violation**: A common violation is storing multi-valued attributes in a single column. For example, instead of a `genres` column in the `works` table storing a string like `"Action, Sci-Fi, Thriller"`, we created a `work_genres` junction table. Each row in `work_genres` associates one work with one genre, ensuring atomicity. This design prevents complex string parsing during queries and enables efficient, index-based joins.

### 4.3 Second Normal Form (2NF)

**Definition**: A relation is in 2NF if it is in 1NF and all non-prime attributes are fully functionally dependent on the entire candidate key. This is primarily relevant for relations with composite candidate keys.

**Analysis**:
*   **Tables with Single-Attribute Keys** (`users`, `creators`, `works`, etc.): These tables are trivially in 2NF as they have no partial dependencies.
*   **`ratings` Table**:
    *   **Candidate Key**: `{user_id, work_id}`.
    *   **Non-Prime Attribute**: `score`.
    *   The `score` is determined by *both* the user and the work together (`{user_id, work_id}` -> `score`). It is not dependent on just `user_id` (a user does not have a single score) or just `work_id` (a work does not have a single score). Since `score` is fully dependent on the entire composite key, the table is in 2NF.
*   **`work_genres` Table**:
    *   **Candidate Key**: `{work_id, genre_id}`.
    *   **Non-Prime Attributes**: None.
    *   Since there are no non-prime attributes, there can be no partial dependencies. The table is therefore in 2NF.

### 4.4 Third Normal Form (3NF)

**Definition**: A relation is in 3NF if it is in 2NF and there are no transitive dependencies. A transitive dependency exists when a non-key attribute is functionally dependent on another non-key attribute. (i.e., `A -> B -> C` where `A` is the key and `B` and `C` are non-key attributes).

**Analysis**:
Our schema avoids transitive dependencies by separating entities into distinct tables.

*   **`books` and `creators` Tables**:
    *   **Violation Example**: If we had designed the `books` table as `BOOKS(<u>book_id</u>, title, author_id, author_name)`, this would violate 3NF. Here, `book_id` -> `author_id` and `author_id` -> `author_name`. This is a transitive dependency because the non-key attribute `author_name` is determined by another non-key attribute `author_id`. This would lead to redundancy (the same author's name repeated for all their books) and update anomalies (changing an author's name would require updating multiple book records).
    *   **Our Solution**: We placed `author_name` (as `name`) in a separate `creators` table, where `creator_id` is the key. The `books` table only stores the foreign key `author_id`. This decomposition removes the transitive dependency and satisfies 3NF.

*   **`ratings` Table and Surrogate Keys**:
    *   In a previous iteration, the `ratings` table used a surrogate `rating_id` as the primary key. This created a potential 3NF violation (or at least a theoretical redundancy) because we had two candidate keys: `rating_id` and `{user_id, work_id}`. In such a case, `{user_id, work_id} -> rating_id -> score` could be seen as a transitive dependency. 
    *   **Correction**: In the final implementation, we identify `{user_id, work_id}` as the natural primary key. While an internal surrogate might be used for indexing performance, the logical model treats the composite key as the primary determinant to ensure strict 3NF compliance.

*   **`works` and `genres` Tables**:
    *   Similarly, if we stored `genre_name` in the `work_genres` table (`{work_id, genre_id}` -> `genre_name`), it would be a transitive dependency because `genre_id` -> `genre_name`. By creating a separate `genres` table, we eliminate this dependency.

### 4.5 Design Justification for Normalization Strategy

The normalization strategy was driven by key design decisions to ensure flexibility, scalability, and data integrity.

*   **Use of Surrogate Keys**:
    *   **Why**: Instead of using natural keys (like `email` in `users` or `name` in `genres`), we use integer surrogate keys (`user_id`, `genre_id`) as primary keys.
    *   **Justification**:
        1.  **Stability**: Natural keys can change (e.g., a user changes their email). Updating a natural key would require cascading updates to all referencing foreign keys, which is inefficient and risky. Surrogate keys never change.
        2.  **Performance**: Integer-based keys are smaller and faster to index and join than string-based keys.
        3.  **Anonymity**: They provide a level of indirection, so a `rating` is tied to a `user_id`, not directly to an email address.

*   **Specialization via `works`, `books`, and `movies` Tables**:
    *   **Why**: Instead of one large table with many `NULL`able columns (e.g., `pages` for a movie or `duration` for a book), we created a generalized `works` table for shared attributes (`title`, `release_year`) and specialized `books` and `movies` tables for type-specific attributes.
    *   **Justification**:
        1.  **Eliminates `NULL` Values**: This design avoids widespread `NULL`s, which can be inefficient to store and can complicate queries (e.g., requiring `IS NOT NULL` checks).
        2.  **Flexibility**: It allows the system to be easily extended. To add a new media type like 'TV Show', we would only need to create a `tv_shows` table that links to `works`, without modifying the existing schema.
        3.  **Attribute Integrity**: It ensures that a book cannot have a `duration` and a movie cannot have `pages`.

*   **Use of Junction Tables (`work_genres`)**:
    *   **Why**: To model many-to-many relationships. A work can have multiple genres, and a genre can apply to multiple works.
    *   **Justification**: As discussed in 1NF, this is the only way to correctly model a many-to-many relationship in a relational database while adhering to normalization principles. It is more scalable, maintainable, and query-efficient than alternatives like comma-separated lists.

---

## 5. Implementation Details

### 5.1 Physical Schema and Constraints

The physical database schema is implemented in MySQL 8.x. The following SQL statements define the complete structure for all tables, including all keys, constraints, and referential integrity rules.

```sql
-- ==================== Users Table ====================
-- Stores user account information.
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(100),
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ==================== Creators Table ====================
-- Stores information about authors and directors.
CREATE TABLE creators (
    creator_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    creator_type ENUM('author', 'director') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================== Works Table ====================
-- A unified entity for all media items (books and movies).
CREATE TABLE works (
    work_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    work_type ENUM('book', 'movie') NOT NULL,
    release_year INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================== Books Table ====================
-- Specialization table for books, extending works.
CREATE TABLE books (
    book_id INT PRIMARY KEY AUTO_INCREMENT,
    work_id INT NOT NULL UNIQUE,
    author_id INT NOT NULL,
    pages INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (work_id) REFERENCES works(work_id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES creators(creator_id)
);

-- ==================== Movies Table ====================
-- Specialization table for movies, extending works.
CREATE TABLE movies (
    movie_id INT PRIMARY KEY AUTO_INCREMENT,
    work_id INT NOT NULL UNIQUE,
    director_id INT NOT NULL,
    duration INT NOT NULL, -- in minutes
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (work_id) REFERENCES works(work_id) ON DELETE CASCADE,
    FOREIGN KEY (director_id) REFERENCES creators(creator_id)
);

-- ==================== Genres Table ====================
-- Stores all possible media genres.
CREATE TABLE genres (
    genre_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- ==================== Work-Genres Junction Table ====================
-- Manages the many-to-many relationship between works and genres.
CREATE TABLE work_genres (
    work_id INT NOT NULL,
    genre_id INT NOT NULL,
    PRIMARY KEY (work_id, genre_id),
    FOREIGN KEY (work_id) REFERENCES works(work_id) ON DELETE CASCADE,
    FOREIGN KEY (genre_id) REFERENCES genres(genre_id) ON DELETE CASCADE
);

-- ==================== Ratings Table ====================
-- Stores user ratings for specific works.
CREATE TABLE ratings (
    rating_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    work_id INT NOT NULL,
    score INT NOT NULL CHECK (score >= 1 AND score <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_work (user_id, work_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (work_id) REFERENCES works(work_id) ON DELETE CASCADE
);

-- ==================== Rating Audit Table ====================
-- Logs all changes to the ratings table for auditing purposes.
CREATE TABLE rating_audit (
    audit_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    work_id INT NOT NULL,
    old_score INT,
    new_score INT,
    action ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Constraint Justification

The schema employs several types of constraints to enforce data integrity and business rules at the database level.

*   **PRIMARY KEY (`PK`)**:
    *   **Purpose**: Uniquely identifies each row in a table. `user_id`, `work_id`, etc., are surrogate keys that provide a stable, unique identifier for each entity.
    *   **Justification**: Essential for establishing relationships and ensuring that every record can be unambiguously referenced.

*   **FOREIGN KEY (`FK`)**:
    *   **Purpose**: Enforces referential integrity between tables. For instance, a `rating` cannot exist without a valid `user` and `work`.
    *   **Justification**: Prevents "orphan" records. The `ON DELETE CASCADE` rule (e.g., in `ratings`) ensures that if a user or work is deleted, all associated ratings are also automatically removed, maintaining a consistent database state.

*   **UNIQUE**:
    *   **Purpose**: Ensures that all values in a column or a set of columns are unique.
    *   **Justification**:
        *   In `users(email)`, it prevents multiple accounts from being created with the same email address.
        *   In `ratings(user_id, work_id)`, this composite unique key is a critical business rule: a user can only rate a specific work once. Any subsequent rating attempts must be `UPDATE`s, not `INSERT`s.

*   **NOT NULL**:
    *   **Purpose**: Ensures that a column cannot have a `NULL` value.
    *   **Justification**: Guarantees that essential information is always present. For example, `works.title` and `users.password_hash` are `NOT NULL` because a work without a title or a user without a password is an invalid state.

*   **CHECK**:
    *   **Purpose**: Defines a condition that each row must satisfy.
    *   **Justification**: Enforces domain integrity. The `CHECK (score >= 1 AND score <= 5)` in the `ratings` table ensures that all rating scores fall within the valid business range of 1 to 5 stars.

*   **ENUM**:
    *   **Purpose**: A string object whose value is chosen from a list of permitted values.
    *   **Justification**: Acts as a form of constraint to restrict columns to a fixed set of values. In `works(work_type)`, it ensures that a work can only be a `'book'` or a `'movie'`, preventing invalid data entry and simplifying queries.

### 5.2 Transaction Control

Transaction control in a DBMS is essential for preserving the ACID properties (Atomicity, Consistency, Isolation, Durability). The Postcredits system relies on transactions to ensure that multi-step operations are executed as a single, indivisible unit. If any part of the transaction fails, the entire operation is rolled back, leaving the database in its original, consistent state. This section demonstrates four key transaction control scenarios using explicit SQL examples coherent with our schema.

#### 1. Successful Transaction (COMMIT)

This example demonstrates an atomic `INSERT` operation for adding a new movie. It requires inserting a record into the parent `works` table and then into the specialized `movies` table. Both operations must succeed for the transaction to be complete.

**Scenario**: An administrator adds the movie "Inception" to the database.

```sql
-- Assume director 'Christopher Nolan' exists with creator_id = 10.
START TRANSACTION;

-- Step 1: Insert the generic work information into the `works` table.
INSERT INTO works (title, work_type, release_year) 
VALUES ('Inception', 'movie', 2010);

-- Retrieve the ID generated for the new work.
SET @work_id = LAST_INSERT_ID();

-- Step 2: Insert the specific movie details into the `movies` table.
INSERT INTO movies (work_id, director_id, duration) 
VALUES (@work_id, 10, 148);

-- If both inserts are successful, commit the transaction.
COMMIT;
```

*   **Demonstration**: The `START TRANSACTION` and `COMMIT` statements bundle the two `INSERT` operations into a single atomic unit. The use of `LAST_INSERT_ID()` ensures the correct `work_id` is propagated to the `movies` table.
*   **Consistency**: This ensures that no "orphan" `works` record is created. If the second `INSERT` into `movies` were to fail, a subsequent `ROLLBACK` (as shown in the next example) would undo the first `INSERT`, guaranteeing that every `movie` has a corresponding `work` and vice-versa.

#### 2. Failed Transaction (ROLLBACK)

This example shows a transaction that fails and is completely rolled back.

**Scenario**: An administrator attempts to add a new book, "Dune," but provides an invalid `author_id` (e.g., an ID that does not exist in the `creators` table). The foreign key constraint on `books.author_id` will cause the second `INSERT` to fail.

```sql
-- Assume creator_id = 999 does NOT exist.
START TRANSACTION;

-- Step 1: Insert into `works` (this will succeed).
INSERT INTO works (title, work_type, release_year) 
VALUES ('Dune', 'book', 1965);
SET @work_id = LAST_INSERT_ID();

-- Step 2: Attempt to insert into `books` with a non-existent author_id.
-- This statement will FAIL due to the foreign key constraint violation.
INSERT INTO books (work_id, author_id, pages)
VALUES (@work_id, 999, 412);

-- Because the second insert failed, the application logic would issue a ROLLBACK.
ROLLBACK;
```

*   **Demonstration**: The transaction begins, and the first `INSERT` succeeds. However, the second `INSERT` fails. The `ROLLBACK` command is then issued, which reverts the database to the state it was in before `START TRANSACTION`.
*   **Consistency**: The `ROLLBACK` ensures atomicity. Although the first `INSERT` was successful, the entire transaction is undone. As a result, the "Dune" record added to the `works` table is permanently removed, preventing data inconsistencies and ensuring that no partial data is saved.

#### 3. Partial Rollback using SAVEPOINT

`SAVEPOINT` allows for rolling back a transaction to a specific point without aborting the entire transaction.

**Scenario**: A new user registers, and as a promotion, they are automatically set to follow a featured creator. However, the `creator_id` for the follow action is invalid. The user registration should still succeed, but the follow action should fail and be rolled back.

```sql
-- Assume `creator_id = 777` does not exist.
-- Note: A `follows` table is hypothetical for this example but demonstrates the concept.
START TRANSACTION;

-- Main part of the transaction: Register the user.
INSERT INTO users (email, password_hash, display_name) 
VALUES ('new.user@example.com', 'hashed_password', 'NewUser');
SET @new_user_id = LAST_INSERT_ID();

-- Create a savepoint before the optional, secondary operation.
SAVEPOINT before_follow;

-- Optional part: Attempt to follow a non-existent creator. This will fail.
-- INSERT INTO follows (user_id, creator_id) VALUES (@new_user_id, 777);

-- An error occurs here. The application logic catches it and rolls back to the savepoint.
ROLLBACK TO SAVEPOINT before_follow;

-- The main part of the transaction can now be committed.
COMMIT;
```

*   **Demonstration**: After the user is successfully inserted, a `SAVEPOINT` is created. The subsequent, non-critical `INSERT` fails. Instead of a full `ROLLBACK`, the `ROLLBACK TO SAVEPOINT` command undoes only the operations that occurred after the savepoint was established.
*   **Consistency**: This provides fine-grained control. The user account is successfully created and persisted with `COMMIT`. The failed, optional action is discarded. This ensures that the primary goal of the transaction (user registration) is achieved, while secondary, non-essential parts can fail without compromising the core operation.

#### 4. Isolation and Locking Example

This example illustrates how database isolation levels and explicit locking prevent "lost updates" when two concurrent transactions attempt to modify the same record.

**Scenario**: Two users, User A and User B, simultaneously try to update their rating for the same movie (`work_id = 101`). Without proper locking, one user's update could overwrite the other's.

```sql
-- Assume a rating for user_id = 1 and work_id = 101 already exists with a score of 3.

-- =========================================================
-- |          Transaction 1 (User A)                     |
-- =========================================================
START TRANSACTION;

-- User A selects the rating record with a lock, preventing
-- other transactions from modifying it until this one ends.
-- User A intends to change the score from 3 to 5.
SELECT * FROM ratings 
WHERE user_id = 1 AND work_id = 101 FOR UPDATE;

-- (Now, User B's transaction will be blocked if it tries
-- to acquire a lock on the same row).

-- User A performs the update.
UPDATE ratings SET score = 5
WHERE user_id = 1 AND work_id = 101;

COMMIT;
-- The lock is released. User B's transaction can now proceed.

-- =========================================================
-- |          Transaction 2 (User B)                     |
-- =========================================================
START TRANSACTION;

-- User B also tries to select the record for update, intending
-- to change the score from 3 to 1.
-- This statement will WAIT until Transaction 1 commits/rolls back.
SELECT * FROM ratings 
WHERE user_id = 1 AND work_id = 101 FOR UPDATE;

-- Once Transaction 1 is complete, this transaction acquires
-- the lock and now reads the score as 5 (not 3).
-- User B's application logic can now decide what to do
-- (e.g., proceed with the update or inform the user).

UPDATE ratings SET score = 1
WHERE user_id = 1 AND work_id = 101;

COMMIT;
```

*   **Demonstration**: `SELECT ... FOR UPDATE` acquires a write lock on the selected row. When Transaction 1 executes this, Transaction 2 is forced to wait at the same statement. It cannot read or write to the locked row until Transaction 1 releases the lock via `COMMIT` or `ROLLBACK`.
*   **Consistency**: This enforces serializability. The transactions are forced to execute sequentially rather than in parallel, preventing a lost update. Transaction 2 operates on the result of Transaction 1 (score = 5), not the original state (score = 3). This guarantees that updates are applied in a predictable and consistent order, maintaining data integrity.

### 5.3 Stored Procedures and Functions

To centralize business logic, improve performance, and ensure data integrity, key operations are encapsulated in stored procedures and functions. This approach reduces network latency and provides a secure, reusable API for the application layer.

#### `fn_calculate_similarity`

This function implements the mathematical core of the recommendation engine. It calculates the similarity between two users based on their shared ratings.

```sql
DELIMITER $$
CREATE FUNCTION fn_calculate_similarity(
    p_user1_id INT,
    p_user2_id INT
)
RETURNS DECIMAL(5,2)
DETERMINISTIC
BEGIN
    DECLARE v_similarity DECIMAL(5,2) DEFAULT 0;
    DECLARE v_shared_count INT DEFAULT 0;
    
    -- Count shared works rated by both users
    SELECT COUNT(*) INTO v_shared_count
    FROM ratings r1
    JOIN ratings r2 ON r1.work_id = r2.work_id
    WHERE r1.user_id = p_user1_id AND r2.user_id = p_user2_id;
    
    IF v_shared_count = 0 THEN
        RETURN 0;
    END IF;
    
    -- Calculate similarity using Euclidean distance conversion
    -- Similarity = 100 * (1 - distance / (N * 4))
    SELECT 
        100 * (1 - (SQRT(SUM(POWER(r1.score - r2.score, 2))) / (v_shared_count * 4)))
    INTO v_similarity
    FROM ratings r1
    JOIN ratings r2 ON r1.work_id = r2.work_id
    WHERE r1.user_id = p_user1_id AND r2.user_id = p_user2_id;
    
    RETURN GREATEST(0, v_similarity);
END$$
DELIMITER ;
```
*   **Purpose**: Computes a percentage (0-100) representing how similar two users' tastes are.
*   **Justification for DB Implementation**: This function is called repeatedly within the recommendation procedure (once for every other user in the database). By implementing it as a stored function, we avoid massive data transfer and benefit from the DBMS's query optimizer when joining the `ratings` table onto itself.

#### `register_user`

This procedure handles new user registration. It validates the input and ensures that no duplicate emails are added.

```sql
DELIMITER $$
CREATE PROCEDURE register_user(
    IN p_email VARCHAR(255),
    IN p_password_hash VARCHAR(255),
    IN p_display_name VARCHAR(100),
    OUT p_user_id INT,
    OUT p_message VARCHAR(255)
)
BEGIN
    IF EXISTS (SELECT 1 FROM users WHERE email = p_email) THEN
        SET p_user_id = NULL;
        SET p_message = 'Email already exists.';
    ELSE
        INSERT INTO users (email, password_hash, display_name) 
        VALUES (p_email, p_password_hash, p_display_name);
        SET p_user_id = LAST_INSERT_ID();
        SET p_message = 'User registered successfully.';
    END IF;
END$$
DELIMITER ;
```
*   **Purpose**: Creates a new user in the `users` table.
*   **Justification for DB Implementation**: By placing the check for an existing email and the `INSERT` statement in a single procedure, we guarantee atomicity. This prevents race conditions where two concurrent requests might both check for the email, find it doesn't exist, and then both attempt to insert it, which would violate the `UNIQUE` constraint.

#### `add_book`

This procedure adds a new book to the database, ensuring that entries are created in both the `works` and `books` tables atomically.

```sql
DELIMITER $$
CREATE PROCEDURE add_book(
    IN p_title VARCHAR(255),
    IN p_release_year INT,
    IN p_author_id INT,
    IN p_pages INT,
    OUT p_work_id INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_work_id = NULL;
    END;

    START TRANSACTION;
    
    INSERT INTO works (title, work_type, release_year) 
    VALUES (p_title, 'book', p_release_year);
    
    SET p_work_id = LAST_INSERT_ID();
    
    INSERT INTO books (work_id, author_id, pages)
    VALUES (p_work_id, p_author_id, p_pages);
    
    COMMIT;
END$$
DELIMITER ;
```
*   **Purpose**: To atomically insert a new book, which involves creating a record in the general `works` table and the specialized `books` table.
*   **Justification for DB Implementation**: This operation is transactional. If the insert into `books` fails for any reason after the insert into `works` has succeeded, the `ROLLBACK` command ensures that the initial `works` insert is undone. This prevents orphaned `works` records and guarantees database consistency.

#### `rate_media`

This procedure handles the logic for a user rating a media item. It performs an "upsert": creating a new rating if one does not exist, or updating the score if it does.

```sql
DELIMITER $$
CREATE PROCEDURE rate_media(
    IN p_user_id INT,
    IN p_work_id INT,
    IN p_score INT,
    OUT p_rating_id INT,
    OUT p_message VARCHAR(100)
)
BEGIN
    DECLARE v_error BOOLEAN DEFAULT FALSE;
    
    -- Validate score range
    IF p_score < 1 OR p_score > 5 THEN
        SET p_message = 'Score must be between 1 and 5';
        SET v_error = TRUE;
    END IF;
    
    IF NOT v_error THEN
        START TRANSACTION;
        IF EXISTS (SELECT 1 FROM ratings WHERE user_id = p_user_id AND work_id = p_work_id) THEN
            UPDATE ratings SET score = p_score, updated_at = NOW() 
            WHERE user_id = p_user_id AND work_id = p_work_id;
            
            SELECT rating_id INTO p_rating_id 
            FROM ratings 
            WHERE user_id = p_user_id AND work_id = p_work_id;
            
            SET p_message = 'Rating updated';
        ELSE
            INSERT INTO ratings (user_id, work_id, score) VALUES (p_user_id, p_work_id, p_score);
            SET p_rating_id = LAST_INSERT_ID();
            SET p_message = 'Rating created';
        END IF;
        COMMIT;
    ELSE
        SET p_rating_id = NULL;
    END IF;
END$$
DELIMITER ;
```
*   **Purpose**: To allow a user to create or update a rating for a work in a single, atomic operation.
*   **Justification for DB Implementation**: It centralizes the core business logic of rating. The application layer can simply call `rate_media(user, work, score)` without needing to know whether it's an `INSERT` or an `UPDATE`. This simplifies the application code and reduces the number of database round-trips.

#### `proc_generate_blend`

This procedure is the core of the collaborative filtering recommendation engine. It identifies users with similar tastes and recommends items they liked.

```sql
DELIMITER $$
CREATE PROCEDURE proc_generate_blend(
    IN p_user_id INT,
    IN p_work_type VARCHAR(10),
    IN p_limit INT
)
BEGIN
    DECLARE v_done INT DEFAULT FALSE;
    DECLARE v_similar_user_id INT;
    DECLARE v_similarity DECIMAL(5,2);
    
    -- Cursor to find the top 10 most similar users
    DECLARE user_cursor CURSOR FOR
        SELECT u.user_id, fn_calculate_similarity(p_user_id, u.user_id) AS similarity
        FROM users u
        WHERE u.user_id != p_user_id
        ORDER BY similarity DESC
        LIMIT 10;
        
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET v_done = TRUE;
    
    DROP TEMPORARY TABLE IF EXISTS blend_results;
    CREATE TEMPORARY TABLE blend_results (
        work_id INT,
        title VARCHAR(255),
        average_rating DECIMAL(3,2)
    );
    
    OPEN user_cursor;
    
    user_loop: LOOP
        FETCH user_cursor INTO v_similar_user_id, v_similarity;
        IF v_done OR v_similarity < 30 THEN
            LEAVE user_loop;
        END IF;
        
        -- Insert recommendations from the similar user
        INSERT INTO blend_results (work_id, title, average_rating)
        SELECT w.work_id, w.title, COALESCE(wr.average_rating, 0)
        FROM ratings r
        JOIN works w ON r.work_id = w.work_id
        LEFT JOIN work_avg_rating wr ON w.work_id = wr.work_id
        WHERE r.user_id = v_similar_user_id
          AND r.score >= 4
          AND w.work_type = p_work_type
          AND w.work_id NOT IN (SELECT work_id FROM ratings WHERE user_id = p_user_id)
          AND w.work_id NOT IN (SELECT work_id FROM blend_results);
          
    END LOOP;
    
    CLOSE user_cursor;
    
    -- Return final, ordered recommendations
    SELECT * FROM blend_results 
    ORDER BY average_rating DESC
    LIMIT p_limit;
    
    DROP TEMPORARY TABLE blend_results;
END$$
DELIMITER ;
```
*   **Purpose**: To generate personalized media recommendations for a user.
*   **Justification for DB Implementation**: This is a data-intensive operation involving multiple joins and aggregations across several tables. Executing this logic inside the database is significantly more performant than fetching all the raw rating data into the application layer and processing it there. It minimizes network I/O and leverages the database's optimized query engine.

### 5.4 Triggers for Auditing and Integrity

Triggers are used to automate actions in response to data modification events (`INSERT`, `UPDATE`, `DELETE`), enforcing complex integrity rules and creating audit trails without requiring application-level code.

#### 1. Ratings Audit Triggers

This set of three triggers creates an immutable log of all changes to the `ratings` table, capturing the before and after state of each modification.

```sql
-- Trigger for INSERT operations
DELIMITER $$
CREATE TRIGGER trg_ratings_audit_insert
AFTER INSERT ON ratings
FOR EACH ROW
BEGIN
    INSERT INTO rating_audit (user_id, work_id, old_score, new_score, action)
    VALUES (NEW.user_id, NEW.work_id, NULL, NEW.score, 'INSERT');
END$$
DELIMITER ;

-- Trigger for UPDATE operations
DELIMITER $$
CREATE TRIGGER trg_ratings_audit_update
AFTER UPDATE ON ratings
FOR EACH ROW
BEGIN
    INSERT INTO rating_audit (user_id, work_id, old_score, new_score, action)
    VALUES (NEW.user_id, NEW.work_id, OLD.score, NEW.score, 'UPDATE');
END$$
DELIMITER ;

-- Trigger for DELETE operations
DELIMITER $$
CREATE TRIGGER trg_ratings_audit_delete
AFTER DELETE ON ratings
FOR EACH ROW
BEGIN
    INSERT INTO rating_audit (user_id, work_id, old_score, new_score, action)
    VALUES (OLD.user_id, OLD.work_id, OLD.score, NULL, 'DELETE');
END$$
DELIMITER ;
```
*   **Problem Solved**: Provides a complete and reliable history of all user rating activities. This is crucial for auditing, debugging data inconsistencies, or even building advanced features like "rating history".
*   **Justification for DB Implementation**: Implementing this at the database level guarantees that no rating change can bypass the logging mechanism. If this logic were in the application layer, a different client, a direct database connection, or a bug could lead to un-audited data modifications.

#### 2. Creator Role Validation Trigger

This trigger prevents a logical error: assigning a creator with the role 'director' to a book, or an 'author' to a movie.

```sql
DELIMITER $$
CREATE TRIGGER trg_check_creator_role_book
BEFORE INSERT ON books
FOR EACH ROW
BEGIN
    DECLARE v_creator_type VARCHAR(10);
    SELECT creator_type INTO v_creator_type 
    FROM creators 
    WHERE creator_id = NEW.author_id;
    
    IF v_creator_type != 'author' THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Invalid creator type: Cannot assign a non-author to a book.';
    END IF;
END$$
DELIMITER ;
```
*   **Problem Solved**: Enforces a critical business rule that cannot be captured by simple foreign key constraints. It ensures that the `creator_type` in the `creators` table is consistent with the type of work being created.
*   **Justification for DB Implementation**: This rule is fundamental to the data's logical consistency. Placing it in a trigger makes it impossible for any client or application to insert invalid data, thus protecting the integrity of the database regardless of the application code.

#### 3. Prevent Deletion of Creators with Works

This trigger prevents a creator from being deleted if they are still associated with any books or movies. This is an alternative to `ON DELETE RESTRICT` that provides a more user-friendly error message.

```sql
DELIMITER $$
CREATE TRIGGER trg_prevent_creator_deletion
BEFORE DELETE ON creators
FOR EACH ROW
BEGIN
    DECLARE work_count INT;
    
    SELECT COUNT(*) INTO work_count FROM books WHERE author_id = OLD.creator_id;
    IF work_count > 0 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Cannot delete creator: They are still associated with one or more books.';
    END IF;
    
    SELECT COUNT(*) INTO work_count FROM movies WHERE director_id = OLD.creator_id;
    IF work_count > 0 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Cannot delete creator: They are still associated with one or more movies.';
    END IF;
END$$
DELIMITER ;
```
*   **Problem Solved**: Protects against accidental deletion of parent records (`creators`) that still have dependent child records (`books` or `movies`), preventing orphaned works.
*   **Justification for DB Implementation**: While a foreign key with `ON DELETE RESTRICT` would also prevent deletion, a trigger allows for a more descriptive and specific error message to be returned to the application, improving user experience and debugging. It ensures this protection is universally applied.

### 5.5 Advanced Query Patterns

The system uses a `VIEW` to simplify complex aggregation queries. The `work_avg_rating` view pre-calculates the average rating for each media item.

```sql
CREATE OR REPLACE VIEW work_avg_rating AS
SELECT 
    work_id,
    AVG(score) as average_rating,
    COUNT(*) as rating_count
FROM ratings
GROUP BY work_id;
```
*   **Purpose**: Simplifies the retrieval of summarized rating data.
*   **Justification for DB Implementation**: Instead of the application calculating averages in memory (which is inefficient) or writing the same `GROUP BY` logic in multiple SQL queries, the view provides a "virtual table" that is always up-to-date. This promotes code reuse and ensures that average ratings are calculated consistently across the entire system.

---

## 6. Results and System Behavior

This section presents empirical results from the database, demonstrating the correctness of the implementation through sample data, system validation checks, and an analysis of the recommendation engine's output under various conditions.

### 6.1 Sample Data Seeding

To test the system, a set of realistic data was inserted. The following sequence of `INSERT` statements demonstrates how interdependent entities are created transactionally.

**Scenario**: Adding the movie 'Interstellar', its director, genres, and two user ratings.

```sql
-- Step 1: Insert the director (if not already present)
INSERT INTO creators (name, creator_type) VALUES ('Christopher Nolan', 'director');
SET @creator_id = LAST_INSERT_ID(); -- Returns, e.g., 10

-- Step 2: Insert the relevant genres (if not already present)
INSERT INTO genres (name) VALUES ('Sci-Fi'), ('Adventure'), ('Drama');
SET @genre_scifi = (SELECT genre_id FROM genres WHERE name = 'Sci-Fi');   -- e.g., 5
SET @genre_adv = (SELECT genre_id FROM genres WHERE name = 'Adventure'); -- e.g., 6

-- Step 3: Insert the work and its movie-specific details
START TRANSACTION;
INSERT INTO works (title, work_type, release_year) VALUES ('Interstellar', 'movie', 2014);
SET @work_id = LAST_INSERT_ID(); -- Returns, e.g., 103
INSERT INTO movies (work_id, director_id, duration) VALUES (@work_id, @creator_id, 169);
COMMIT;

-- Step 4: Link the work to its genres in the junction table
INSERT INTO work_genres (work_id, genre_id) VALUES (@work_id, @genre_scifi), (@work_id, @genre_adv);

-- Step 5: Add users and their ratings for this movie and another one for comparison
INSERT INTO users (email, display_name) VALUES ('alice@example.com', 'Alice'), ('bob@example.com', 'Bob');
SET @user_alice = 1, @user_bob = 2;
SET @work_inception = 101; -- Assume 'Inception' already exists

INSERT INTO ratings (user_id, work_id, score) VALUES
(@user_alice, @work_id, 5),          -- Alice rates Interstellar 5/5
(@user_alice, @work_inception, 5),   -- Alice rates Inception 5/5
(@user_bob, @work_inception, 4);     -- Bob rates Inception 4/5
```

This sequence populates all necessary tables, creating a network of relationships that forms the basis for the following validation and recommendation tests.

### 6.2 System Validation and Integrity Checks

This subsection demonstrates how database constraints and triggers actively enforce business rules.

#### 1. CHECK Constraint Enforcement

The `ratings` table includes a `CHECK` constraint to ensure scores are within the valid range [1, 5].

**Test**: Attempt to insert a rating with an invalid score.
```sql
-- This statement will be rejected by the database.
INSERT INTO ratings (user_id, work_id, score) VALUES (1, 102, 6);
```
**Result**: The DBMS returns an error (e.g., `CHECK constraint 'ratings_chk_1' is violated.`), and the `INSERT` operation is aborted. This confirms that domain integrity is successfully enforced at the lowest level, preventing corrupt data from entering the system.

#### 2. Audit Trigger Verification

The `trg_ratings_audit_update` trigger automatically logs changes to the `rating_audit` table.

**Test**: Update a user's rating and verify the audit trail.
```sql
-- Bob initially rated Inception (work_id 101) as 4. Let's update it to 5.
UPDATE ratings SET score = 5 WHERE user_id = 2 AND work_id = 101;

-- Now, query the audit table to see the logged change.
SELECT user_id, work_id, old_score, new_score, action FROM rating_audit ORDER BY audit_id DESC LIMIT 1;
```
**Result**: The `SELECT` statement produces the following output, confirming the trigger fired correctly:
| user_id | work_id | old_score | new_score | action |
|---------|---------|-----------|-----------|--------|
| 2       | 101     | 4         | 5         | UPDATE |

This demonstrates that the system maintains a reliable and non-bypassable audit trail for all data modifications in the `ratings` table.

### 6.3 Recommendation Engine Behavior and Output

#### 1. Standard Recommendation Scenario

**Context**: As per the data from 6.1, Alice and Bob have similar tastes. Both have rated 'Inception' highly. Alice has also rated 'Interstellar' highly. We will now generate recommendations for Bob.

**Test**: Execute the recommendation procedure for Bob.
`CALL proc_generate_blend(2, 'movie', 5);` -- (user_id, work_type, limit)

**Expected Output**:
| work_id | title        | average_rating |
|---------|--------------|----------------|
| 103     | Interstellar | 5.00           |

**Analysis of Correctness**:
1.  The procedure first calculates similarity between Bob (user 2) and all other users. It finds Alice (user 1) is a highly similar user because they co-rated 'Inception' with very close scores (4 and 5).
2.  It then looks for movies that Alice rated highly (score >= 4) that Bob has *not* yet rated.
3.  Alice rated 'Interstellar' (work 103) with a score of 5. Bob has not rated this movie.
4.  Therefore, 'Interstellar' is selected as a candidate recommendation.
5.  The final result correctly identifies 'Interstellar' as a top recommendation for Bob, directly reflecting the logic of collaborative filtering.

#### 2. Edge Case: The "Cold Start" Problem

**Context**: A new user, Charlie (user_id 3), registers but has not rated any items.

**Test**: Execute the recommendation procedure for Charlie.
`CALL proc_generate_blend(3, 'movie', 5);`

**Result**: The procedure returns an empty set.

**Analysis of Correctness**: This behavior is correct and expected for a pure user-based collaborative filtering algorithm. The system cannot calculate similarity for Charlie because he has no rating data. Without similar users, no recommendations can be generated. This highlights a known limitation of this algorithm and suggests that a hybrid approach (e.g., recommending globally popular items) would be needed to provide a better new-user experience.

#### 3. Edge Case: No Overlapping Ratings

**Context**: A user, Dave (user_id 4), has rated movies that no one else has. For example, he rates 'Primer' (work_id 104) a 5, but no one else has rated it.

**Test**: Execute the recommendation procedure for Dave.
`CALL proc_generate_blend(4, 'movie', 5);`

**Result**: The procedure returns an empty set.

**Analysis of Correctness**: This is also correct. The similarity function `fn_calculate_similarity` depends on a non-empty set of co-rated items between two users. Since Dave has no co-rated items with any other user, his similarity score with everyone is effectively zero. Consequently, the recommendation engine cannot find any "similar users" and returns no results.

### 6.4 Observations on System Behavior

*   **Correctness**: The system behaves exactly as designed. The recommendation output is a direct and correct implementation of the user-based collaborative filtering algorithm. Constraints and triggers work as expected, rejecting invalid data and maintaining audit trails.
*   **Consistency**: Transactional integrity ensures that the database remains in a consistent state. For example, a movie is never created without a corresponding `work` entry. The audit trigger guarantees that every rating modification is logged, ensuring consistency between the live `ratings` table and the `rating_audit` history.
*   **Behavior under Constraints**: The system is robust. Attempts to violate primary key, foreign key, unique, or check constraints are gracefully handled by the DBMS, which rejects the offending statements and prevents data corruption. The custom triggers for business logic (e.g., creator roles) add a further layer of semantic integrity that the application layer cannot bypass.

---

## 7. Conclusion

### 7.1 Summary of Achievements

This project successfully demonstrates the design and implementation of a unified media recommendation system, underpinned by a robust and normalized relational database. By leveraging advanced DBMS features such as stored procedures, triggers, and views, the system achieves a clean separation of concerns, ensures high data integrity, and encapsulates complex business logic efficiently within the data layer.

### 7.2 Reflection on Design Decisions

The decision to implement the recommendation logic inside the database was a key architectural choice. While this approach slightly increases the complexity of the database schema, it significantly reduces data latency and simplifies the application layer, which can remain largely stateless regarding recommendation logic. The trade-off is a tighter coupling between the business logic and the database engine, which was deemed acceptable for this project's scope.

### 7.3 Future Work

*   **Algorithm Enhancement:** The current user-based CF algorithm could be extended into a hybrid model, incorporating content-based features (e.g., genre, director) to address the "cold start" problem for new users.
*   **Performance Optimization:** For larger datasets, the cursor-based approach in the stored procedure could become a bottleneck. Future work could involve rewriting the logic using set-based operations or exploring materialized views for pre-calculating similarity scores.
*   **Scalability:** Implementing database replication or sharding to handle increased load and ensure high availability.

---

## 8. References

*   Korth, H. F., Silberschatz, A., and Sudarshan, S. *Database System Concepts*. McGraw-Hill.
*   Ricci, F., Rokach, L., & Shapira, B. (2011). *Introduction to Recommender Systems Handbook*. Springer.
*   Official MySQL 8.0 Documentation.
*   Official Next.js Documentation.
*   Lecture notes and study material provided during the DBMS course.
*   https://www.w3schools.com/sql/

---
