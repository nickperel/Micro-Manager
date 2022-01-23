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
    choices: ['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee', 'update an employee role']
})
.then((answers) => {
    switch(answers.action){
        case 'view all departments':
           viewAllDepartments(); 
           break;
        case 'view all roles':
            console.log('view all roles');
            break;
        case 'add a department':
            addDepartment();
            break;
        };
    });
};

const viewAllDepartments = () => {
    connection.promise().query('SELECT * FROM department')
    .then(([rows]) => {
        console.table(rows);
        mainPrompt();
    });
    // connection.query("SELECT * FROM department", (err, result) => {
    //     console.table(result)
    // })
};

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