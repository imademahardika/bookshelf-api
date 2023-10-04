const {
    addBookHandl,
    getAllBooksHandl,
    getBookByIdHandl,
    updateBookByIdHandl,
    deleteBookByIdHandl,
} = require('./handler');

const routes = [
    {
        method: 'POST',
        path: '/books',
        handler: addBookHandl,
    },
    {
        method: 'GET',
        path: '/books',
        handler: getAllBooksHandl,
    },
    {
        method: 'GET',
        path: '/books/{bookId}',
        handler: getBookByIdHandl,
    },
    {
        method: 'PUT',
        path: '/books/{bookId}',
        handler: updateBookByIdHandl,
    },
    {
        method: 'DELETE',
        path: '/books/{bookId}',
        handler: deleteBookByIdHandl,
    }
];

module.exports = routes;