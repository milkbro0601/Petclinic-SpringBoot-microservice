CREATE TABLE IF NOT EXISTS treatments (
    id         INTEGER IDENTITY PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    price       DECIMAL(10,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS medicines (
    id          INTEGER IDENTITY PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    unit        VARCHAR(50) NOT NULL,
    price       DECIMAL(10,2) NOT NULL
);