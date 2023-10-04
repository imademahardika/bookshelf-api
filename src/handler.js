const { nanoid } = require('nanoid');
const books = require('./books');

//Handler untuk menambah buku baru
const addBookHandl = (request ,a) => {
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading
    } = request.payload;

    //Validasi untuk properti 'name' tidak boleh kosong
    if(!name) {
        const response = a.response({
            "status": "fail",
            "message": "Gagal menambahkan buku. Mohon isi nama buku"
        });

        response.code(400);
        return response;
    }

    //Validasi untuk nilai 'readPage' tidak melebihi 'pageCount'
    if(readPage > pageCount) {
        const response = a.response({
            "status": "fail",
            "message": "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount"
        });

        response.code(400);
        return response;
    }

    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = pageCount === readPage;

    const newBook = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        insertedAt,
        updatedAt
    };

    //Setelah semua aturan diatas terpenuhi, maka
    books.push(newBook);
    const isSuccess = books.filter((book) => book.id === id).length > 0;

    //Respon jika buku berhasil ditambahkan
    if (isSuccess) {
        const response = a.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id
            }
        });

        response.code(201);
        return response;
    }

    //Respon jika buku gagal ditambahkan
    const response = a.response({
        status: 'fail',
        message: 'Buku gagal ditambahkan'
    });

    response.code(500);
    return response;
};


//Handler mengambil semua buku dengan filter opsional
const getAllBooksHandl = (request, a) => {
    const {
        name,
        reading,
        finished
    } = request.query;

    //Menginisialisasikan daftar buku yang akan difilter
    let filteredBooks = books;

    //Memfilter berdasarkan 'name' yang ada dalam query
    if (name) {
        filteredBooks = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
    }

    //Memfilter berdasarkan 'reading' yang ada dalam query
    if (reading) {
        filteredBooks = books.filter((book) => Number(book.reading) === Number(reading));
    }

    //Memfilter berdasarkan 'finished' yang ada dalam query    
    if (finished) {
        filteredBooks = books.filter((book) => Number(book.finished) === Number(finished));
    }

    //Mengirim respon JSON dengan daftar buku yang sudah difilter
    const response = a.response({
        status: 'success',
        data: {
            books: filteredBooks.map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher
            }))
        }
    });

    response.code(200);
    return response;
};

//Handler untuk mengambil buku berdasarkan ID
const getBookByIdHandl = (request, a) => {
    const {
        id
    } = request.params;

    const book = books.filter((b) => b.id === id)[0];

    //Respon 'success' jika buku ditemukan
    if (book !== undefined) {
        return {
            status: 'success',
            data: {
                book
            }
        };
    }

    //Respon 'fail' jika buku tidak ditemukan
    const response = a.response({
        status: 'fail',
        message: 'Buku tidak ditemukan'
    });

    response.code(404);
    return response;
};

//Handler untuk mengedit buku berdasarkan ID
const updateBookByIdHandl = (request, a) => {
    const {
        id
    } = request.params;

    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading
    } = request.payload;

    const updatedAt= new Date().toISOString();
    const index = books.findIndex((book) => book.id === id);

    //Validasi untuk properti 'name' terdapat dalam payload permintaan
    if (!name) {
        const response = a.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku'
        });

        request.code(400);
        return response;
    }

    //Validasi untuk properti 'readPage' tidak melebihi 'pageCount'
    if (readPage > pageCount) {
        const response = a.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
        });

        response.code(400);
        return response;
    }

    if (index !== -1) {
        const finished = pageCount === readPage;

        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            finished,
            reading,
            updatedAt
        };

        //Respon sukses jika buku berhasil diperbarui
        const response = a.response({
            status: 'success',
            message: 'Buku berhasil diperbarui'
        });

        request.code(200);
        return response;
    }

    //Respon gagal jika ID buku tidak ditemukan
    const response = a.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan'
    });

    request.code(404);
    return response;
};

//Handler untuk menghapus buku berdasarkan ID
const deleteBookByIdHandl = (request, a) => {
    const {
        id
    } = request.params;

    const index = books.findIndex((note) => note.id === id);

    //Apabila ID tersebut valid pada salah satu buku, maka respon tersebut sukses
    if (index !== -1){
        books.splice(index, 1);
        const response = a.response({
            status: 'success',
            message: 'Buku berhasil dihapus'
        });
        
        response.code(200);
        return response;
    }

    //Apabila ID tersebut tidak dimiliki oleh buku manapun, maka respon tersebut gagal
    const response = a.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan'
    });

    response.code(404);
    return response;
};

module.exports = {
    addBookHandl,
    getAllBooksHandl,
    getBookByIdHandl,
    updateBookByIdHandl,
    deleteBookByIdHandl
};