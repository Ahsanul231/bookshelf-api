import { nanoid } from 'nanoid';
const books = [];

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: (request, h) => {
      const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

      if (!name) {
        return h.response({
          status: 'fail',
          message: 'Gagal menambahkan buku. Mohon isi nama buku',
        }).code(400);
      }

      if (readPage > pageCount) {
        return h.response({
          status: 'fail',
          message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        }).code(400);
      }

      const id = nanoid();
      const insertedAt = new Date().toISOString();
      const updatedAt = insertedAt;
      const finished = pageCount === readPage;

      const newBook = {
        id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
      };

      books.push(newBook);

      return h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          bookId: id,
        },
      }).code(201);
    },
  },
  {
    method: 'GET',
    path: '/books',
    handler: (request, h) => {
      const { name, reading, finished } = request.query;
      let result = books;

      if (name) {
        result = result.filter(book => book.name.toLowerCase().includes(name.toLowerCase()));
      }

      if (reading !== undefined) {
        result = result.filter(book => book.reading === (reading === '1'));
      }

      if (finished !== undefined) {
        result = result.filter(book => book.finished === (finished === '1'));
      }

      const response = result.map(book => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      }));

      return h.response({
        status: 'success',
        data: {
          books: response,
        },
      });
    },
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: (request, h) => {
      const { bookId } = request.params;
      const book = books.find(b => b.id === bookId);

      if (!book) {
        return h.response({
          status: 'fail',
          message: 'Buku tidak ditemukan',
        }).code(404);
      }

      return h.response({
        status: 'success',
        data: {
          book,
        },
      });
    },
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: (request, h) => {
      const { bookId } = request.params;
      const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

      const book = books.find(b => b.id === bookId);

      if (!book) {
        return h.response({
          status: 'fail',
          message: 'Gagal memperbarui buku. Id tidak ditemukan',
        }).code(404);
      }

      if (!name) {
        return h.response({
          status: 'fail',
          message: 'Gagal memperbarui buku. Mohon isi nama buku',
        }).code(400);
      }

      if (readPage > pageCount) {
        return h.response({
          status: 'fail',
          message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        }).code(400);
      }

      book.name = name;
      book.year = year;
      book.author = author;
      book.summary = summary;
      book.publisher = publisher;
      book.pageCount = pageCount;
      book.readPage = readPage;
      book.reading = reading;
      book.finished = pageCount === readPage;
      book.updatedAt = new Date().toISOString();

      return h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
      });
    },
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: (request, h) => {
      const { bookId } = request.params;
      const bookIndex = books.findIndex(b => b.id === bookId);

      if (bookIndex === -1) {
        return h.response({
          status: 'fail',
          message: 'Buku gagal dihapus. Id tidak ditemukan',
        }).code(404);
      }

      books.splice(bookIndex, 1);

      return h.response({
        status: 'success',
        message: 'Buku berhasil dihapus',
      });
    },
  },
];

export default routes;
