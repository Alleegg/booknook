CREATE TABLE genres (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(50) NOT NULL UNIQUE,
    CONSTRAINT genres_name_nonempty CHECK (char_length(trim(name)) > 0)
);

CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    genre_id INTEGER NOT NULL REFERENCES genres (id) ON DELETE RESTRICT,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT books_title_nonempty CHECK (char_length(trim(title)) > 0),
    CONSTRAINT books_author_nonempty CHECK (char_length(trim(author)) > 0)
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(200) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    total_amount NUMERIC(12, 2) NOT NULL CHECK (total_amount >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
    book_id INTEGER NOT NULL REFERENCES books (id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
    UNIQUE (order_id, book_id)
);

CREATE INDEX idx_books_genre_id ON books (genre_id);
CREATE INDEX idx_order_items_order_id ON order_items (order_id);
CREATE INDEX idx_order_items_book_id ON order_items (book_id);

INSERT INTO genres (name, slug) VALUES
    ('Фэнтези', 'fantasy'),
    ('Наука', 'science'),
    ('Художественная литература', 'fiction');

INSERT INTO books (genre_id, title, author, price) VALUES
    (1, 'Властелин колец', 'Дж. Р. Р. Толкин', 1500.00),
    (2, 'Краткая история времени', 'Стивен Хокинг', 1200.00),
    (3, '1984', 'Джордж Оруэлл', 800.00),
    (1, 'Гарри Поттер', 'Дж. К. Роулинг', 1300.00),
    (2, 'Sapiens', 'Юваль Харари', 1400.00),
    (3, 'Мастер и Маргарита', 'Михаил Булгаков', 900.00);
