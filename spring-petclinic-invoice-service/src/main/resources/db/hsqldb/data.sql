INSERT INTO invoices (visit_id, pet_id, owner_id, total_amount, status) VALUES (1, 1, 1, 80.00, 'PENDING');

INSERT INTO invoice_treatments (invoice_id, treatment_id, treatment_name, quantity, unit_price, subtotal) VALUES (IDENTITY(), 1, 'General Checkup', 1, 50.00, 50.00);

INSERT INTO invoice_medicines (invoice_id, medicine_id, medicine_name, quantity, unit_price, subtotal) VALUES (IDENTITY(), 1, 'Amoxicillin', 2, 5.00, 10.00);