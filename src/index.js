#! /usr/bin/env node

/**
 * TASKNINJA -
 * Task Manager CLI Application
 * This application allows users to manage their tasks via command line interface.
 * It supports adding, listing, and removing tasks.
 * Dependencies:
 * - commander: For command line argument parsing
 * - inquirer: For interactive prompts
 * - fs: For file system operations
 * Author: Mohamed Bakr
 * Date: January 2026
 * Version: 1.1.4
 * @license MIT
 * Copyright (c) 2026 Mohamed Bakr
 */

// for using commands in terminal
import { Command } from "commander";
// for interactive command line prompts
import inquirer from "inquirer";
// for colored text 
import chalk from 'chalk';

// helpers
import {displayTasks, enableEscExit, cleanupAndExit} from './helpers/helpers.js';

// assigning Commander to a variable
const program = new Command();

// importing validators and allowed values
import { validateDueDate, ALLOWED_PRIORITIES, ALLOWED_STATUSES } from "./utils/validators.js";
// importing task service functions
import { loadTasks, saveTasks, getNextId, saveDeletedTask, loadDeletedTask, clearDeletedTask, cleanupExpiredDeletedTasks } from "./utils/taskService.js";


// setting up
program
    .name("taskninja")
    .description("A simple CLI application to manage your tasks")
    .version("1.1.4");

// use command 'add' with title + status + priority + dueDate + description and action
program
    .command('add')
    .alias('a')
    .description('Add a new task')
    .action(async () => {
        enableEscExit();
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
            },
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
    console.log(chalk.green('Task added successfully!'));
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
                console.log(chalk.red(`Invalid status filter. Allowed statuses are: ${ALLOWED_STATUSES.join(", ")}`));
                cleanupAndExit(0);
            }
            tasks = tasks.filter(task => task.status === options.status);
        }
        // display all tasks in table format
        displayTasks(tasks);
        cleanupAndExit(0);
    });



// use command 'search' to find tasks by keyword in title or description
program
    .command('search [keyword]')
    .alias('sr')
    .option('-f, --find <keyword>', 'Keyword to search in title or description')
    .description('Search tasks by keyword in title or description')
    .action(async (keyword, options) => {
        const tasks = await loadTasks();
        let searchTerm = keyword || options.find;

        if (!searchTerm) {
            enableEscExit();
            const answers = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'term',
                    message: 'Enter the keyword you want to search for:',
                    validate: input => input ? true : 'Keyword cannot be empty!'
                },
                {
                    type: 'rawlist',
                    name: 'field',
                    message: 'Where do you want to search?',
                    choices: ['title', 'description', 'both'],
                    default: 'both'
                }
            ]);
            searchTerm = answers.term;
            const field = answers.field;

            const founded = tasks.filter(task => {
                if (field === 'title') return task.title.toLowerCase().includes(searchTerm.toLowerCase());
                if (field === 'description') return task.description.toLowerCase().includes(searchTerm.toLowerCase());
                return task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                    task.description.toLowerCase().includes(searchTerm.toLowerCase());
            });

            if (!founded.length) {
                console.log(chalk.red('No task matched your search!'));
                cleanupAndExit(0);
            }

            displayTasks(founded);
            cleanupAndExit(0);
        }

        const founded = tasks.filter(task =>
            task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.description.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (!founded.length) {
            console.log(chalk.red('No task matched your search!'));
            cleanupAndExit(0);
        }

        displayTasks(founded);
        cleanupAndExit(0);
    });




// use command 'sort' to sort tasks by due date, priority, or status
program
    .command('sort')
    .alias('so')
    .option('--by <criteria>', 'Sort tasks by criteria (dueDate, priority, status)')
    .description('Sort tasks by due date, priority, or status')
    .action( async (options) => {

        const tasks = await loadTasks();
        let criteria = options.by;

        if (!criteria) {
            enableEscExit();
            const answer = await inquirer.prompt([
                {
                    type: 'rawlist',
                    name: 'criteria',
                    message: 'Sort tasks by:',
                    choices: ['dueDate', 'priority', 'status']
                }
            ]);
            criteria = answer.criteria;
        }
        // normailze input `case-insensitive + separators`
        criteria = criteria.toLowerCase().replace(/[-_]/g, '');
        
        if (!['duedate', 'priority', 'status'].includes(criteria)) {
            console.log(chalk.red('Invalid sort criteria. Use --by with dueDate, priority, or status.'));
            cleanupAndExit(0);
        }
        // sorting logic
        const sortedTasks = [...tasks];

        switch (criteria) {
            case 'duedate':
                sortedTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
                break;
            case 'priority':
                const priorityOrder = { 'high': 1, 'medium': 2, 'low': 3 };
                sortedTasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
                break;
            case 'status':
                const statusOrder = { 'todo': 1, 'in-progress': 2, 'done': 3 };
                sortedTasks.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
                break;
            default:
                console.log(chalk.red('Invalid sort criteria. Use dueDate, priority, or status.'));
                cleanupAndExit(0);
        }

        displayTasks(sortedTasks);
        cleanupAndExit(0);
    });


// use command 'update' with task ID and action
program 
    .command('update')
    .alias('up')
    .description('Update a task by ==> ID <==')
    .action(async () =>{
        const tasks = await loadTasks();
        if (!tasks.length) {
            console.log(chalk.red('No tasks found to update.'));
            cleanupAndExit(0);
        }
        enableEscExit();
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
            console.log(chalk.red('Task not found!'));
            cleanupAndExit(0);
        }

        enableEscExit();
        const answers = await inquirer.prompt([
      // for title
        {
            type: 'confirm',
            name: 'changeTitle',
            message: 'Do you want to change the title?',
            default: false
        },
        {
            type: 'input',
            name: 'title',
            message: 'Enter the new title:',
            when: answers => answers.changeTitle,
            validate: input => input ? true : 'Title cannot be empty!'
        },

      // for status
        {
            type: 'confirm',
            name: 'changeStatus',
            message: 'Do you want to change the status?',
            default: false
        },
        {
            type: 'rawlist',
            name: 'status',
            message: 'Select the new status:',
            choices: ALLOWED_STATUSES,
            when: answers => answers.changeStatus
        },

      // for priority
        {
            type: 'confirm',
            name: 'changePriority',
            message: 'Do you want to change the priority?',
            default: false
        },
        {
            type: 'rawlist',
            name: 'priority',
            message: 'Select the new priority:',
            choices: ALLOWED_PRIORITIES,
            when: answers => answers.changePriority
        },

      // for due date
        {
            type: 'confirm',
            name: 'changeDueDate',
            message: 'Do you want to change the due date?',
            default: false
        },
        {
            type: 'input',
            name: 'dueDate',
            message: 'Enter the new due date (YYYY-MM-DD):',
            when: answers => answers.changeDueDate,
            validate: input => {
                try {
                    validateDueDate(input);
                    return true;
                } catch (error) {
                    return error.message;
                }
            }
        },

      // for description
        {
            type: 'confirm',
            name: 'changeDescription',
            message: 'Do you want to change the description?',
            default: false
        },
        {
            type: "input",
            name: 'description',
            message: 'Enter the new description:',
            when: answers => answers.changeDescription,
            validate: input => input.trim() ? true : 'Description cannot be empty!'
        }
    ]);

    // apply updates only if user chose to change them
    if (answers.changeTitle) task.title = answers.title;
    if (answers.changeStatus) task.status = answers.status;
    if (answers.changePriority) task.priority = answers.priority;
    if (answers.changeDueDate) task.dueDate = answers.dueDate;
    if (answers.changeDescription)
        task.description = answers.description || '';

    // is there any change?
    const hasChanges = [
            answers.changeTitle,
            answers.changeStatus,
            answers.changePriority,
            answers.changeDueDate,
            answers.changeDescription
        ].some(Boolean);

        if (!hasChanges) {
            console.log(chalk.yellow('No changes were made.'));
        }else {
            // save updated tasks to file
            await saveTasks(tasks);
            console.log(chalk.green('Task updated successfully!'));
        }
    
        displayTasks(tasks);
        cleanupAndExit(0);
    });


// use command 'done' with task ID instead of 'update' + confirm to mark task as done
program
    .command('done')
    .description('Mark a task as done by ==> ID <==')
    .action(async () => {
        const tasks = await loadTasks();
        if (!tasks.length) {
            console.log(chalk.magenta('Congratulations! All tasks are already done.'));
            cleanupAndExit(0);
        }

        const activeTasks = tasks.filter(t => t.status !== 'done');
        if (!activeTasks.length) {
            console.log(chalk.magenta('Congratulations! All tasks are already done.'));
            cleanupAndExit(0);
        }
        enableEscExit();
        const { id } = await inquirer.prompt([
            {
                type: 'rawlist',
                name: 'id',
                message: 'Select the task to mark as done:',
                choices: activeTasks.map(t => (
                    {
                        name: `${t.id}: ${t.title}[Current Status: ${t.status}]`,
                        value: t.id
                    }
                ))
            }
        ]);

        const task = tasks.find(t => t.id === Number(id));
        task.status = 'done';
        await saveTasks(tasks);
        console.log(chalk.green('Task marked as done successfully!'));

        displayTasks(tasks);
        cleanupAndExit(0);
    });



// use command 'delete' with task ID and action
program
    .command('delete')
    .alias('del')
    .description('delete a task by ==> ID <==')
    .action(async () => {
        const tasks = await loadTasks();
        if (!tasks.length) {
            console.log(chalk.yellow('No tasks found to delete.'));
            cleanupAndExit(0);
        }
        enableEscExit();
        const { id } = await inquirer.prompt([
            {
                type: 'rawlist',
                name: 'id',
                message: 'Select the task to delete:',
                choices: tasks.map(task => ({ name: `${task.id}: ${task.title}`, value: task.id }))
            }
        ]);
        enableEscExit();
        const { confirm } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'confirm',
                message: 'Are you sure you want to delete this task?',
                default: false
            }
        ]);
        if (!confirm) {
            console.log(chalk.yellow('Task deletion cancelled.'));
            cleanupAndExit(0);
        }
        const taskToDelete = tasks.find(t => t.id === Number(id));
        // save deleted task for undo functionality
        await saveDeletedTask(taskToDelete);
        // filter out the deleted task
        const newTasks = tasks.filter(t => t.id !== Number(id));

        await saveTasks(newTasks);
        console.log(chalk.green('Task deleted successfully!'));
        console.log(chalk.cyan('You can undo this action by using the `undo` command.'));

        displayTasks(newTasks);
        cleanupAndExit(0);
    });

// use command 'undo' to restore last deleted task
program
.command('undo')
.alias('un')
.description('Undo the last deleted task')
.action( async () => {
    await cleanupExpiredDeletedTasks();

    const deletedTasks = await loadDeletedTask();
    if (!deletedTasks || !deletedTasks.length) {
        console.log(chalk.yellow('No deleted task to restore.'));
        cleanupAndExit(0);
    }

    const lastDeletedTask =  deletedTasks.pop();

    const tasks = await loadTasks();
    tasks.push(lastDeletedTask);
    tasks.sort((a, b) => a.id - b.id); // keep tasks sorted by ID
    await saveTasks(tasks);
    // await clearDeletedTask();

    console.log(chalk.green(`Last deleted task restored successfully!, (Task name: ${lastDeletedTask.title})`));
});



// parse command line arguments
program.parse(process.argv);
