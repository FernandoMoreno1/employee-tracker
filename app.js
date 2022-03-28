const mysql = require('mysql');
const inquirer = require('inquirer');
const consoleTable = require('console.table')

// creates connection to sql database
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'Tables_DB'
})

//this is what should start the application and connect the mysql to the db
connection.connect(function(err){
    if (err) throw err;
    startScreen();
})

// // Initalize the app
// var init = () => {
//     startScreen();
// }

//this is the first list that will show up and run eevrything
function startScreen() {
    inquirer
        .prompt({
            name: 'applicationStart',
            type: 'list',
            message: 'What would you like to do?',
            choices: [
                    'View all departments',
                    'View all roles',
                    'View all employees',
                    'Add a department',
                    'Add a role',
                    'Add an employee',
                    'Update an employee role',
                    'Quit'
                    ]
            }).then(function (answer) {
                switch (answer.applicationStart) {
                    case 'View all departments':
                        viewDepartments();
                        break;
                    case 'View all roles':
                        viewRoles();
                        break;
                    case 'View all employees':
                        viewEmployees();
                        break;
                    case 'Add an department':
                        addDepartment();
                        break;
                    case 'Add a employee':
                        addEmployee();
                        break;
                    case 'Add a role':
                        addRole();
                        break;
                    case 'Update an employee role':
                        updateRole();
                        break;
                    case 'Quit': 
                        QuitApp();
                        break;
                    default:
                        break;
                }
        })
};

// view all employees in the database
function viewEmployees() {
    var query = 'SELECT * FROM employee';
    connection.query(query, function(err, res) {
        if (err) throw err;
        console.log(res.length + ' employees found!');
        console.table('All Employees:', res); 
        startScreen();
    })
};

//this will go ahead and find the deparment table in schema.sql and bring it back otherwise it will send an error and at the end it will call the start function
function viewDepartments() {
    var query = 'SELECT * FROM department';
    connection.query(query, function(err, res) {
        if(err)throw err;
        console.table('All Departments:', res);
        startScreen();
    })
};

//this is going to get the roles table and the deparment table combinig then to get the deparment id and at the end it will call the start function
function viewRoles() {
    var query = 'SELECT * FROM role';
    connection.query(query, function(err, res){
        if (err) throw err;
        console.table('All Roles:', res);
        startScreen();
    })
};

// this is going to get the employee table and join it with the other two or else it will send a error and at the end it will call the start function
function addEmployee() {
    connection.query('SELECT * FROM role', function (err, res) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: 'first_name',
                    type: 'input', 
                    message: "What is the employee's first name? ",
                },
                {
                    name: 'last_name',
                    type: 'input', 
                    message: "What is the employee's last name? "
                },
                {
                    name: 'manager_id',
                    type: 'input', 
                    message: "What is the employee's manager ID? "
                },
                {
                    name: 'role', 
                    type: 'list',
                    choices: function() {
                    var roleArray = [];
                    for (let i = 0; i < res.length; i++) {
                        roleArray.push(res[i].title);
                    }
                    return roleArray;
                    },
                    message: "What is this employee's role? "
                }
                ]).then(function (answer) {
                    let role_id;
                    for (let a = 0; a < res.length; a++) {
                        if (res[a].title == answer.role) {
                            role_id = res[a].id;
                            console.log(role_id)
                        }                  
                    }  
                    connection.query(
                    'INSERT INTO employee SET ?',
                    {
                        first_name: answer.first_name,
                        last_name: answer.last_name,
                        manager_id: answer.manager_id,
                        role_id: role_id,
                    },
                    function (err) {
                        if (err) throw err;
                        console.log('Your employee has been added!');
                        startScreen();
                    })
                })
        })
};

// add a department to the db
function addDepartment() {
    inquirer
        .prompt([
            {
                name: 'newDepartment', 
                type: 'input', 
                message: 'What is the name of the new department?'
            }
            ]).then(function (answer) {
                connection.query(
                    'INSERT INTO department SET ?',
                    {
                        name: answer.newDepartment
                    });
                var query = 'SELECT * FROM department';
                connection.query(query, function(err, res) {
                if(err)throw err;
                console.log('Your department has been added!');
                startScreen();
                })
            })
};

// add a role to the db
function addRole() {
    connection.query('SELECT * FROM department', function(err, res) {
        if (err) throw err;
    
        inquirer 
        .prompt([
            {
                name: 'new_role',
                type: 'input', 
                message: "What is the name of this role?"
            },
            {
                name: 'salary',
                type: 'input',
                message: 'What is the salry of this role?'
            },
            {
                name: 'Department',
                type: 'list',
                choices: function() {
                    var deptArry = [];
                    for (let i = 0; i < res.length; i++) {
                    deptArry.push(res[i].name);
                    }
                    return deptArry;
                },
            }
        ]).then(function (answer) {
            let department_id;
            for (let a = 0; a < res.length; a++) {
                if (res[a].name == answer.Department) {
                    department_id = res[a].id;
                }
            }
    
            connection.query(
                'INSERT INTO role SET ?',
                {
                    title: answer.new_role,
                    salary: answer.salary,
                    department_id: department_id
                },
                function (err, res) {
                    if(err)throw err;
                    console.log('Your new role has been added!');
                    startScreen();
                })
        })
    })
};

// update a role in the db
function updateRole() {
    connection.query("SELECT * FROM EMPLOYEE", (err, emplRes) => {
                if (err) throw err;
                const employeeChoice = [];
                emplRes.forEach(({ first_name, last_name, id }) => {
                    employeeChoice.push({
                        name: first_name + " " + last_name,
                        value: id
                    });
                });
        
                //this shouldget all the roles into make choice of employee's role
                connection.query("SELECT * FROM ROLE", (err, rolRes) => {
                    if (err) throw err;
                    const roleChoice = [];
                    rolRes.forEach(({ title, id }) => {
                        roleChoice.push({
                            name: title,
                            value: id
                        });
                    });
        
                    let questions = [
                        {
                            type: "list",
                            name: "id",
                            choices: employeeChoice,
                            message: "whose role do you want to update?"
                        },
                        {
                            type: "list",
                            name: "role_id",
                            choices: roleChoice,
                            message: "what is the employee's new role?"
                        }
                    ]
        
                    inquier.prompt(questions)
                        .then(response => {
                            const query = `UPDATE EMPLOYEE SET ? WHERE ?? = ?;`;
                            connection.query(query, [
                                { role_id: response.role_id },
                                "id",
                                response.id
                            ], (err, res) => {
                                if (err) throw err;
        
                                console.log("successfully updated employee's role!");
                                startPrompt();
                            });
                        })
                        .catch(err => {
                            console.error(err);
                        });
                })
            });
};

// exit the app
function QuitApp() {
    console.log('Goodbye!');
    connection.end();
};