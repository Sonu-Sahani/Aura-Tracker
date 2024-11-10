CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL UNIQUE
);


CREATE TABLE user_profile (
    profile_id INT PRIMARY KEY,
    student_name VARCHAR(50) NOT NULL,
    user_id INT UNIQUE,   -- Ensures a one-to-one relationship
    registration_num VARCHAR(8) NOT NULL UNIQUE,
    gender VARCHAR(10) NOT NULL,
    year VARCHAR(10) NOT NULL,
    branch VARCHAR(100) NOT NULL,
    contact VARCHAR(10) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE, 
    profile_picture_url VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE uploadedassignment (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    dueDate VARCHAR(10),
    comments TEXT,
    filename TEXT,
    Data BYTEA NOT NULL,
    year VARCHAR(10),
    branch VARCHAR(100)
);


CREATE TABLE submitassignment(
    id SERIAL PRIMARY KEY,
    profile_id INT,
    assignment_id INT,
    submitdate VARCHAR(10),
    filename TEXT,
    data BYTEA NOT NULL,
    completed BOOLEAN,
    FOREIGN KEY (profile_id) REFERENCES user_profile(profile_id)
);


CREATE TABLE schedule (
    id SERIAL PRIMARY KEY,
    day INT,
    time VARCHAR(50),
    subject VARCHAR(50),
    teacher VARCHAR(50),
    venue VARCHAR(50),
    year VARCHAR(1) NOT NULL,
    branch VARCHAR(5) NOT NULL,
    section VARCHAR(1) NOT NULL
);




CREATE TABLE study_goals (
    id SERIAL PRIMARY KEY,
    goal VARCHAR(255) NOT NULL,
    target_date DATE NOT NULL,
    notes TEXT,
    completed BOOLEAN DEFAULT FALSE,
    profile_id INT -- foreign key if linking to a users table
);
