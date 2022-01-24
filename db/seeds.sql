INSERT INTO department (name)
VALUES
    ('Sales'),
    ('Legal'),
    ('Engineering'),
    ('Finance');

INSERT INTO role (title, salary, department_id)
VALUES
    ('Sales Team Lead', 145000.00, 1),
    ('Salesperson', 75000.00, 1),
    ('Legal Team Lead', 220000.00, 2),
    ('Lawyer', 185000.00, 2),
    ('Lead Engineer', 175000.00, 3),
    ('Software Engineer', 165000.00, 3),
    ('Account Manager', 135000.00, 4),
    ('Accountant', 115000.00, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
    ('Nick', 'Perel', 5, NULL),
    ('Matt', 'Delacruz', 1, NULL),
    ('Young', 'Rhyu', 8, 5),
    ('Riley', 'Harris', 3, NULL),
    ('Amy', 'Suchidolski', 7, NULL),
    ('Marley', 'Cohen', 2, 2),
    ('Robert', 'Witschger', 4, 4),
    ('Mike', 'Carbone', 6, 1);