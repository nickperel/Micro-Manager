const inquirer = require('inquirer');
const mysql2 = require('mysql2');
require('console.table');

const connection = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'micro_db'
});

connection.connect(() => {
    console.log('database connected');
});

const mainPrompt = () => {
    inquirer.prompt({
    type: 'list',
    name: 'action',
    message: 'What would you like to do?',
    choices: ['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee', 'update an employee role', 'exit the application']
})
.then((answers) => {
    switch(answers.action){
        case 'view all departments':
            viewDepartments(); 
            break;
        case 'view all roles':
            viewRoles();
            break;
        case 'view all employees':
            viewEmployees();
            break;
        case 'add a department':
            addDepartment();
            break;
        case 'add a role':
            addRole();
            break;
        case 'add an employee':
            addEmployee();
            break;
        case 'update an employee role':
            updateRole();
            break;
        case 'exit the application':
            console.log('Come back soon!')
            process.exit(0);
        };
    });
};

const viewDepartments = () => {
    const sql = `SELECT * FROM department`

    connection.query(sql, (err, res) => {
        if (err) console.log({ error: err.message });
        console.table(res);
        mainPrompt();
    });
}

const viewRoles = () => {
    const sql = `SELECT role.id AS role_id, role.title AS job_title, role.salary, department.name AS department
                 FROM role
                 LEFT JOIN department ON role.department_id = department.id`;

    connection.query(sql, (err, res) => {
        if (err) console.log({ error: err.message });
        console.table(res);
        mainPrompt();
    });
}

const viewEmployees = () => {
    const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title AS job_title, department.name AS department, role.salary AS salary, employee.manager_id AS manager
                 FROM employee
                 LEFT JOIN employee m ON employee.manager_id = m.id
                 LEFT JOIN role ON employee.role_id = role.id
                 LEFT JOIN department ON role.department_id = department.id`;

    connection.query(sql, (err, res) => {
        if (err) console.log({ error: err.message });
        console.table(res);
        mainPrompt();
    });
} 

const addDepartment = () => {

    // inquirer prompt

    // connection.query(`INSERT INTO department (name) VALUES (${answers.name})`, (err, result) => {
    //     console.table(result)
    // })
    inquirer.prompt([{
        type: 'input',
        name: 'id',
        message: 'What is the id of this department?'
    }, {
        type: 'input',
        name: 'name',
        message: 'What is the name of this department?'
    }])
    .then((answers) => {
        console.log(answers)
        connection.query(`INSERT INTO department (id, name) VALUES ?`, [answers], (err, result) => {
            if (err) throw err;
            console.table(result)
        })
    })

    
}

mainPrompt();