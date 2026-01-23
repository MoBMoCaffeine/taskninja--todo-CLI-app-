#! /usr/bin/env node

/**
 * Task Manager CLI Application
 * This application allows users to manage their tasks via command line interface.
 * It supports adding, listing, and removing tasks.
 * Dependencies:
 * - commander: For command line argument parsing
 * - inquirer: For interactive prompts
 * - fs: For file system operations
 * Author: Mohamed Bakr
 * Date: Jan 2026
 * Version: 1.0.0 -> 1.0.2
 */

// for using commands in terminal
import { Command } from "commander";
// for interactive command line prompts
import inquirer from "inquirer";
// for file system operations
import fs from "fs/promises";

// assigning Commander to a variable
const program = new Command();

// file to store tasks
const TASKS_FILE = "./todos.json";
// allowed task statuses
const ALLOWED_STATUSES = ["todo", "in-progress", "done"];
// allowed task priorities
const ALLOWED_PRIORITIES = ["low", "medium", "high"];


// function to load tasks from file
const loadTasks = async () => {
    try{
        const data = await fs.readFile(TASKS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') return [];
        throw error;
    }
};
// function to save tasks to file
const saveTasks = async (tasks) => {
    await fs.writeFile(TASKS_FILE, JSON.stringify(tasks, null, 2));
};
// get next task ID
const getNextId = (tasks) => {
    return tasks.length > 0 ? Math.max(...tasks.map(task => task.id)) + 1 : 1;
};
// validate task status
const validateStatus = (status) => {
    if (!ALLOWED_STATUSES.includes(status)) {
        throw new Error(`Invalid status. Allowed statuses are: ${ALLOWED_STATUSES.join(", ")}`);
    }
};
// validate task priority
const validatePriority = (priority) => {
    if (!ALLOWED_PRIORITIES.includes(priority)) {
        throw new Error(`Invalid priority. Allowed priorities are: ${ALLOWED_PRIORITIES.join(", ")}`);
    }  
};
// verify due date format
const validateDueDate = (dueDate) => {
    if (isNaN(Date.parse(dueDate))) {
        throw new Error("Invalid due date. Please use a valid date format (YYYY-MM-DD).");
    }
};


// setting up
program
    .name("todo-cli")
    .description("A simple CLI application to manage your tasks")
    .version("1.0.0");

// use command 'add' with title + status + priority + dueDate + description and action
program
    .command('add')
    .alias('a')
    .description('Add a new task')
    .action(async (title, status, priority, dueDate, description = "") => {
        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message : 'Task Title:',
                validate : input => input ? true : 'Title cannot be empty!'
            },
            {
                type: 'list',
                name: 'status',
                message : 'Task Status:',
                choices : ALLOWED_STATUSES,
                default : 'todo'
            },
            {
                type: 'list',
                name: 'priority',
                message : 'Task Priority:',
                choices : ALLOWED_PRIORITIES,
                default : 'medium'
            },
            {
                type: 'input',
                name: 'dueDate',
                message : 'Due Date (YYYY-MM-DD):',
                validate : input => {
                    try {
                        validateDueDate(input);
                        return true;
                    } catch (error) {
                        return error.message;
                    }
                }
            },
            {
                type: 'input',
                name: 'description',
                message : 'Task Description (optional):'    
            }
        ]);
    // load existing tasks
    const tasks = await loadTasks();

        // create new task object
    const newTask = {
        id: getNextId(tasks),
        title: answers.title,
        status: answers.status,
        priority: answers.priority,
        dueDate: answers.dueDate,
        description: answers.description || ''
    };
    // add new task to tasks array
    tasks.push(newTask);
    // save updated tasks to file
    await saveTasks(tasks);
    console.log("Task added successfully!");
});


// use command 'list' with optional status filter and action
program
    .command('list')
    .alias('ls')
    .description('List all tasks')
    .option('-s, --status <status>', 'Filter tasks by status')
    .action(async (options) => {
        let tasks = await loadTasks();

        if (options.status) {
            if (!ALLOWED_STATUSES.includes(options.status)){
                console.error(`Invalid status filter. Allowed statuses are: ${ALLOWED_STATUSES.join(", ")}`);
                process.exit(1);
            }
            tasks = tasks.filter(task => task.status === options.status);
        }
        if (tasks.length === 0) {
            console.log('No tasks found.');
            return;
        }
       // map all tasks to displayable objects
        const tableData = tasks.map(task => ({
            ID: task.id,
            Title: task.title,
            Status: task.status,
            Priority: task.priority,
            DueDate: task.dueDate,
            Description: task.description || ''
        }));

        // display all tasks in table format
        console.table(tableData);
    });

// use command 'update' with task ID and action
program 
    .command('update')
    .alias('up')
    .description('Update a task by ID')
    .action(async () =>{
        const tasks = await loadTasks();
        if (tasks.length === 0) {
            console.log('No tasks found to update.');
            return;
        }

        const { id } = await inquirer.prompt([
            {
                type: 'list',
                name: 'id',
                message: 'Select the task to update:',
                choices: tasks.map(task => ({ name: `${task.id}: ${task.title}`, value: task.id }))
            }
        ]);
        const { status } = await inquirer.prompt([
            {
                type: 'list',
                name: 'status',
                message: 'Select the new status:',
                choices: ALLOWED_STATUSES
            }
        ]);

        const task = tasks.find(t => t.id === Number(id));
        if (!task) {
            console.error('Task not found!');
            return;
        }
        task.status = status;

        await saveTasks(tasks);
        console.log('Task updated successfully!');

       // map all tasks to displayable objects
        const tableData = tasks.map(task => ({
            ID: task.id,
            Title: task.title,
            Status: task.status,
            Priority: task.priority,
            DueDate: task.dueDate,
            Description: task.description || ''
        }));

        // display all tasks in table format
        console.table(tableData);
    });

// use command 'delete' with task ID and action
program
    .command('delete')
    .alias('del')
    .description('delete a task by ID')
    .action(async () => {
        const tasks = await loadTasks();
        if (tasks.length === 0) {
            console.log('No tasks found to delete.');
            return;
        }

        const { id } = await inquirer.prompt([
            {
                type: 'list',
                name: 'id',
                message: 'Select the task to delete:',
                choices: tasks.map(task => ({ name: `${task.id}: ${task.title}`, value: task.id }))
            }
        ]);

        const { confirm } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'confirm',
                message: 'Are you sure you want to delete this task?',
                default: false
            }
        ]);
        if (!confirm) {
            console.log('Task deletion cancelled.');
            return;
        }

        const newTasks = tasks.filter(t => t.id !== id);
        await saveTasks(newTasks);
        console.log('Task deleted successfully!');

        // map all tasks to displayable objects
        const tableData = tasks.map(task => ({
            ID: task.id,
            Title: task.title,
            Status: task.status,
            Priority: task.priority,
            DueDate: task.dueDate,
            Description: task.description || ''
        }));

        // display all tasks in table format
        console.table(tableData);
    });

// parse command line arguments
program.parse(process.argv);
