CREATE TABLE IF NOT EXISTS invoices (
    id           INTEGER IDENTITY PRIMARY KEY,
    visit_id     INTEGER NOT NULL,
    pet_id       INTEGER NOT NULL,
    owner_id     INTEGER NOT NULL,
    invoice_date TIMESTAMP DEFAULT NOW(),
    total_amount DECIMAL(10,2) DEFAULT 0.00,
    status       VARCHAR(20) DEFAULT 'PENDING'
);

CREATE TABLE IF NOT EXISTS invoice_treatments (
    id             INTEGER IDENTITY PRIMARY KEY,
    invoice_id     INTEGER NOT NULL,
    treatment_id   INTEGER NOT NULL,
    treatment_name VARCHAR(100) NOT NULL,
    quantity       INTEGER NOT NULL,
    unit_price     DECIMAL(10,2) NOT NULL,
    subtotal       DECIMAL(10,2),
    FOREIGN KEY (invoice_id) REFERENCES invoices(id)
);

CREATE TABLE IF NOT EXISTS invoice_medicines (
    id            INTEGER IDENTITY PRIMARY KEY,
    invoice_id    INTEGER NOT NULL,
    medicine_id   INTEGER NOT NULL,
    medicine_name VARCHAR(100) NOT NULL,
    quantity      INTEGER NOT NULL,
    unit_price    DECIMAL(10,2) NOT NULL,
    subtotal      DECIMAL(10,2),
    FOREIGN KEY (invoice_id) REFERENCES invoices(id)
);