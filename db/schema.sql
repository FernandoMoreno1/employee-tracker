DROP DATABASE IF EXISTS Tables_DB;
CREATE DATABASE Tables_DB;

-- USE when on mysql -u root -p
-- then source db/schema.sql
-- then source db/seeds.sql
-- quit and start app

USE Tables_DB;


-- Create the table for department
CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    PRIMARY KEY (id)
);

-- Create the table for roles
CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT NOT NULL,
    PRIMARY KEY (id)
);

-- Create the table for employees
CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT NULL,
    PRIMARY KEY (id)
);