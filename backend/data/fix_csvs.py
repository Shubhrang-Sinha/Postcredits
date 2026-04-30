#!/usr/bin/env python3
"""
Fix CSV files to match Postcredits database schema.
- Keeps only columns needed for DB
- First author/genre only
- Strips 'min' from duration
- Adds fake data for missing columns
"""

import csv
import random
import os

# Fake data generators
FAKE_DESCRIPTIONS = [
    "A compelling story that captivates readers from start to finish.",
    "An unforgettable journey through twists and turns of fate.",
    "A masterpiece of storytelling that will be remembered for years.",
    "An epic adventure that explores the depths of human emotion.",
    "A gripping tale of suspense and intrigue.",
]

FAKE_THUMBNAILS = [
    "https://example.com/covers/book_001.jpg",
    "https://example.com/covers/movie_001.jpg",
]


def process_books():
    """Process books_data.csv to match schema."""
    input_file = "books_original.csv"
    output_file = "books.csv"

    rows = []
    with open(input_file, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for i, row in enumerate(reader):
            # Get title (required)
            title = row.get("title", "").strip()
            if not title:
                continue

            # Get release_year (published_year)
            release_year = row.get("published_year", "").strip()
            release_year = int(release_year) if release_year.isdigit() else 2000

            # Get pages (num_pages)
            pages = row.get("num_pages", "").strip()
            pages = int(pages) if pages.isdigit() else 200

            # Get first author
            authors = row.get("authors", "").strip()
            author = authors.split(";")[0].strip() if authors else "Unknown Author"

            # Get first genre (from categories)
            categories = row.get("categories", "").strip()
            genre = categories.split(",")[0].strip() if categories else "Fiction"

            # Fake data for missing columns
            description = random.choice(FAKE_DESCRIPTIONS)
            thumbnail = f"https://example.com/covers/book_{i + 1:03d}.jpg"

            rows.append(
                {
                    "title": title,
                    "release_year": release_year,
                    "pages": pages,
                    "author": author,
                    "genre": genre,
                    "description": description,
                    "thumbnail": thumbnail,
                }
            )

    # Write output
    fieldnames = [
        "title",
        "release_year",
        "pages",
        "author",
        "genre",
        "description",
        "thumbnail",
    ]
    with open(output_file, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    print(f"✓ Processed {len(rows)} books -> {output_file}")
    return rows


def process_movies():
    """Process movies_data.csv to match schema."""
    input_file = "movies_original.csv"
    output_file = "movies.csv"

    rows = []
    with open(input_file, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for i, row in enumerate(reader):
            # Only process movies (skip TV shows)
            media_type = row.get("type", "").strip().lower()
            if media_type != "movie":
                continue

            # Get title (required)
            title = row.get("title", "").strip()
            if not title:
                continue

            # Get release_year
            release_year = row.get("release_year", "").strip()
            release_year = int(release_year) if release_year.isdigit() else 2020

            # Get director (first one only if multiple)
            director = row.get("director", "").strip()
            if not director:
                director = "Unknown Director"
            else:
                # Take first director if comma-separated
                director = director.split(",")[0].strip()

            # Get duration - strip "min" to get integer
            duration_str = row.get("duration", "").strip()
            duration = 0
            if duration_str:
                # Remove "min" and any whitespace
                duration_str = duration_str.replace("min", "").strip()
                duration = int(duration_str) if duration_str.isdigit() else 90

            # Get first genre (from listed_in)
            listed_in = row.get("listed_in", "").strip()
            genre = listed_in.split(",")[0].strip() if listed_in else "Drama"

            # Fake data for missing columns
            description = random.choice(FAKE_DESCRIPTIONS)
            thumbnail = f"https://example.com/covers/movie_{i + 1:03d}.jpg"

            rows.append(
                {
                    "title": title,
                    "release_year": release_year,
                    "director": director,
                    "duration": duration,
                    "genre": genre,
                    "description": description,
                    "thumbnail": thumbnail,
                }
            )

    # Write output
    fieldnames = [
        "title",
        "release_year",
        "director",
        "duration",
        "genre",
        "description",
        "thumbnail",
    ]
    with open(output_file, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    print(f"✓ Processed {len(rows)} movies -> {output_file}")
    return rows


if __name__ == "__main__":
    # Change to data directory
    os.chdir(os.path.dirname(os.path.abspath(__file__)))

    print("Processing CSV files...")
    print("-" * 40)

    books = process_books()
    movies = process_movies()

    print("-" * 40)
    print(f"Total: {len(books)} books, {len(movies)} movies")
    print("Done!")
