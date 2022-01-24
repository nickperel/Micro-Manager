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
            // mainPrompt();
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

function addDepartment() {
    // inquirer prompt
    return inquirer.prompt([{
        type: 'input',
        name: 'name',
        message: 'What is the name of this department?'
    }
])
.then(res => {
    console.log(res);
    const sql = 'INSERT INTO department SET ?';

    connection.query(sql, res, function(err, result) {
        if (err) throw err;
        console.log('Successfully added department!')
        mainPrompt();
     });
});
};

function addRole() {
    // inquirer prompt
    return inquirer.prompt([{
        type: 'input',
        name: 'title',
        message: 'What is the name of this role?'
    },
    {
        type: 'input',
        name: 'salary',
        message: 'What is the salary for this role?'
    },
    {
        type: 'list',
        name: 'department',
        message: 'What department does this role belong to?',
        choices: ['Sales', 'Legal', 'Engineering', 'Finance']
    }
])
.then(res => {
    console.log(res);

    const deptIds = [
        {
            name: 'sales',
            id: 1
        },
        {
            name: 'legal',
            id: 2
        },
        {
            name: 'engineering',
            id: 3
        },
        {
            name: 'finance',
            id: 4
        }
]

    const deptObj = deptIds.find(d => d.name.toLowerCase() == res.department.toLowerCase())

    res.department_id = deptObj.id;
    delete res.department;

    res.salary = parseFloat(res.salary);

    const sql = 'INSERT INTO role SET ?';

    connection.query(sql, res, function(err, result) {
        if (err) throw err;
        console.log('Successfully added role!')
        mainPrompt();
     });
});
};

function addEmployee() {
    // inquirer prompt
    return inquirer.prompt([{
        type: 'input',
        name: 'first_name',
        message: 'What is the first name of this employee?'
    },
    {
        type: 'input',
        name: 'last_name',
        message: 'What is the last name of this employee?'
    },
    {
        type: 'list',
        name: 'role',
        message: 'What is the role of this employee?',
        choices: ['Salesperson', 'Lawyer', 'Software Engineer', 'Accountant']
    },
    {
        type: 'list',
        name: 'manager_id',
        message: 'What is the name of the manager for this employee?',
        choices: ['Nick Perel', 'Matt Delacruz', 'Riley Harris', 'Amy Suchidolski']
    }
])
.then(res => {
    console.log(res);

    const roleIds = [
        {
            name: 'salesperson',
            id: 2
        },
        {
            name: 'lawyer',
            id: 4
        },
        {
            name: 'software engineer',
            id: 6
        },
        {
            name: 'accountant',
            id: 8
        }
]

    const roleObj = roleIds.find(r => r.name.toLowerCase() == res.role.toLowerCase())

    res.role_id = roleObj.id;
    delete res.role;

    const managerIds = [
        {
            name: 'Nick Perel',
            id: 1
        },
        {
            name: 'Matt Delacruz',
            id: 2
        },
        {
            name: 'Riley Harris',
            id: 4
        },
        {
            name: 'Amy Suchidolski',
            id: 5
        }
]

const managerObj = managerIds.find(m => m.name.toLowerCase() == res.manager_id.toLowerCase())

    res.manager_id = managerObj.id;
    delete res.manager;

    const sql = 'INSERT INTO employee SET ?';
    connection.query(sql, res, function(err, result) {
        if (err) throw err;
        console.log('Successfully added role!')
        mainPrompt();
     });
});
};

const updateRole = (roleId, employeeId) => {
        // inquirer prompt
        inquirer.prompt([{
            type: 'list',
            name: 'employee',
            message: "Which employee's role would you like to update?",
            choices: ['Nick Perel', 'Matt Delacruz', 'Young Rhyu', 'Riley Harris', 'Amy Suchidolski', 'Marley Cohen', 'Robert Witschger', 'Mike Carbone']
        }
        ])
        .then(res => {
            console.log(res);
            const sql = 'UPDATE employee SET role_id = ? WHERE id = ?';
            connection.query(sql, [roleId, employeeId], (err, result) => {
                if (err) return console.log({ error: err.message });
                console.log(`Employee's role was successfully updated!`)
                mainPrompt();
                return;
            });
        });
    };

mainPrompt();