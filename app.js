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

// assigning Commander to a variable
const program = new Command();

// importing validators and allowed values
import { validateDueDate, ALLOWED_PRIORITIES, ALLOWED_STATUSES } from "./validators.js";
// importing task service functions
import { loadTasks, saveTasks, getNextId } from "./taskService.js";


// setting up
program
    .name("todo-cli")
    .description("A simple CLI application to manage your tasks")
    .version("1.0.4");

// use command 'add' with title + status + priority + dueDate + description and action
program
    .command('add')
    .alias('a')
    .description('Add a new task')
    .action(async () => {
        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message : 'Task Title:',
                validate : input => input ? true : 'Title cannot be empty!'
            },
            {
                type: 'rawlist',
                name: 'status',
                message : 'Task Status:',
                choices : ALLOWED_STATUSES,
                default : 'todo'
            },
            {
                type: 'rawlist',
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
    .option('-s, --status <status>', 'Filter tasks by status (todo, in-progress, done)')
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
        const tableData = tasks.map((task, index) => ({
            '#': index + 1,
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
    .description('Update a task by ==> ID <==')
    .action(async () =>{
        const tasks = await loadTasks();
        if (tasks.length === 0) {
            console.log('No tasks found to update.');
            return;
        }

        const { id } = await inquirer.prompt([
            {
                type: 'rawlist',
                name: 'id',
                message: 'Select the task to update (By ID):',
                choices: tasks.map(task => ({ name: `${task.id}: ${task.title}`, value: task.id }))
            }
        ]);

        // find the task to update
        const task = tasks.find(t => t.id === Number(id));
        if (!task) {
            console.error('Task not found!');
            return;
        }
        task.status = status;

        await saveTasks(tasks);
        console.log('Task updated successfully!');

        console.table([{
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
    .description('delete a task by ==> ID <==')
    .action(async () => {
        const tasks = await loadTasks();
        if (tasks.length === 0) {
            console.log('No tasks found to delete.');
            return;
        }

        const { id } = await inquirer.prompt([
            {
                type: 'rawlist',
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

        const newTasks = tasks.filter(t => t.id !== Number(id));
        await saveTasks(newTasks);
        console.log('Task deleted successfully!');

        console.table([{
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
