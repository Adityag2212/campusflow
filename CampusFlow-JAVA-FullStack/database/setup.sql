CREATE DATABASE IF NOT EXISTS campusflow
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE campusflow;

CREATE TABLE IF NOT EXISTS students (
    id BIGINT NOT NULL AUTO_INCREMENT,
    student_code VARCHAR(20) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    major VARCHAR(80) NOT NULL,
    phone VARCHAR(15),
    gpa DECIMAL(3,2) NOT NULL,
    date_of_birth DATE,
    PRIMARY KEY (id),
    CONSTRAINT uk_student_code UNIQUE (student_code),
    CONSTRAINT chk_student_gpa CHECK (gpa >= 0 AND gpa <= 10)
);

INSERT IGNORE INTO students
(student_code, first_name, last_name, major, phone, gpa, date_of_birth)
VALUES
('STU-001', 'Aarav', 'Sharma', 'Computer Science', '9876543210', 8.50, '2003-04-12'),
('STU-002', 'Diya', 'Verma', 'Information Technology', '9876543211', 9.10, '2004-01-22'),
('STU-003', 'Kabir', 'Singh', 'Electronics', '9876543212', 7.80, '2003-09-08'),
('STU-004', 'Ananya', 'Gupta', 'Computer Science', '9876543213', 8.90, '2004-06-17');
