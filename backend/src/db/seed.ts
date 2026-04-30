#!/usr/bin/env node
/**
 * Database Seeding Script
 * Reads CSV files and inserts data into MySQL database
 * 
 * Usage: npx tsx src/db/seed.ts
 * or: npm run db:seed
 */

import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import csv from 'csv-parse/sync';

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = parseInt(process.env.DB_PORT || '3306');
const DB_USER = process.env.DB_USER || 'root';
const DB_PASS = process.env.DB_PASS || '';
const DB_NAME = process.env.DB_NAME || 'postcredits';

interface BookRow {
  title: string;
  release_year: string;
  pages: string;
  author: string;
  genre: string;
  description: string;
  thumbnail: string;
}

interface MovieRow {
  title: string;
  release_year: string;
  director: string;
  duration: string;
  genre: string;
  description: string;
  thumbnail: string;
}

async function seed() {
  console.log('Connecting to database...');
  const connection = await mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
  });

  try {
    // Load CSV files
    const dataDir = path.join(process.cwd(), '..', 'data');
    
    console.log('Loading books.csv...');
    const booksCsv = fs.readFileSync(path.join(dataDir, 'books.csv'), 'utf-8');
    const books: BookRow[] = csv.parse(booksCsv, { columns: true, skip_empty_lines: true });
    console.log(`  Loaded ${books.length} books`);

    console.log('Loading movies.csv...');
    const moviesCsv = fs.readFileSync(path.join(dataDir, 'movies.csv'), 'utf-8');
    const movies: MovieRow[] = csv.parse(moviesCsv, { columns: true, skip_empty_lines: true });
    console.log(`  Loaded ${movies.length} movies`);

    // Track unique creators and genres
    const creators = new Map<string, { name: string; type: 'author' | 'director' }>();
    const genres = new Map<string, string>();

    // Process books - insert creators and genres
    console.log('\nProcessing books...');
    for (const book of books) {
      // Add author
      if (book.author && !creators.has(book.author)) {
        creators.set(book.author, { name: book.author, type: 'author' });
      }
      // Add genre
      if (book.genre && !genres.has(book.genre)) {
        genres.set(book.genre, book.genre);
      }
    }

    // Process movies - insert directors
    console.log('Processing movies...');
    for (const movie of movies) {
      if (movie.director && !creators.has(movie.director)) {
        creators.set(movie.director, { name: movie.director, type: 'director' });
      }
      // Add genre
      if (movie.genre && !genres.has(movie.genre)) {
        genres.set(movie.genre, movie.genre);
      }
    }

    // Insert genres
    console.log(`\nInserting ${genres.size} genres...`);
    for (const [name] of genres) {
      try {
        await connection.execute('INSERT IGNORE INTO genres (name) VALUES (?)', [name]);
      } catch (e) {
        // Ignore duplicate errors
      }
    }

    // Get genre ID mapping
    const [genreRows] = await connection.execute<mysql.RowDataPacket[]>('SELECT genre_id, name FROM genres');
    const genreMap = new Map(genreRows.map(r => [r.name, r.genre_id]));

    // Insert creators
    console.log(`Inserting ${creators.size} creators...`);
    for (const [{ name, type }] of creators) {
      try {
        await connection.execute('INSERT IGNORE INTO creators (name, creator_type) VALUES (?, ?)', [name, type]);
      } catch (e) {
        // Ignore duplicate errors
      }
    }

    // Get creator ID mapping
    const [creatorRows] = await connection.execute<mysql.RowDataPacket[]>('SELECT creator_id, name, creator_type FROM creators');
    const creatorMap = new Map(creatorRows.map(r => [`${r.name}|${r.creator_type}`, r.creator_id]));

    // Insert works + books
    console.log('Inserting books...');
    let booksInserted = 0;
    for (const book of books) {
      const authorKey = `${book.author}|author`;
      const authorId = creatorMap.get(authorKey);
      const genreId = genreMap.get(book.genre);
      
      if (!authorId || !genreId) continue;

      try {
        const [workResult] = await connection.execute<mysql.ResultSetHeader>(
          'INSERT INTO works (title, work_type, release_year) VALUES (?, ?, ?)',
          [book.title, 'book', parseInt(book.release_year) || 2000]
        );
        const workId = workResult.insertId;

        await connection.execute(
          'INSERT INTO books (work_id, author_id, pages) VALUES (?, ?, ?)',
          [workId, authorId, parseInt(book.pages) || 200]
        );

        await connection.execute(
          'INSERT INTO work_genres (work_id, genre_id) VALUES (?, ?)',
          [workId, genreId]
        );

        booksInserted++;
      } catch (e) {
        // Skip duplicates or errors
      }
    }
    console.log(`  Inserted ${booksInserted} books`);

    // Insert works + movies
    console.log('Inserting movies...');
    let moviesInserted = 0;
    for (const movie of movies) {
      const directorKey = `${movie.director}|director`;
      const directorId = creatorMap.get(directorKey);
      const genreId = genreMap.get(movie.genre);
      
      if (!directorId || !genreId) continue;

      try {
        const [workResult] = await connection.execute<mysql.ResultSetHeader>(
          'INSERT INTO works (title, work_type, release_year) VALUES (?, ?, ?)',
          [movie.title, 'movie', parseInt(movie.release_year) || 2020]
        );
        const workId = workResult.insertId;

        await connection.execute(
          'INSERT INTO movies (work_id, director_id, duration) VALUES (?, ?, ?)',
          [workId, directorId, parseInt(movie.duration) || 90]
        );

        await connection.execute(
          'INSERT INTO work_genres (work_id, genre_id) VALUES (?, ?)',
          [workId, genreId]
        );

        moviesInserted++;
      } catch (e) {
        // Skip duplicates or errors
      }
    }
    console.log(`  Inserted ${moviesInserted} movies`);

    console.log('\n✅ Seeding complete!');
    console.log(`  - ${genres.size} genres`);
    console.log(`  - ${creatorMap.size} creators`);
    console.log(`  - ${booksInserted} books`);
    console.log(`  - ${moviesInserted} movies`);

  } catch (error) {
    console.error('Error during seeding:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

seed().catch(console.error);