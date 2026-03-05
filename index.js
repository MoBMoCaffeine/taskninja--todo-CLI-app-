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
 * Version: 1.1.5
 * @license MIT
 * Copyright (c) 2026 Mohamed Bakr
 * @MoBMoCaffeine
 */

// for using commands in terminal
import { Command } from "commander";

import { addAction } from "./src/commands/addCommand.js";
import { listAction } from "./src/commands/listCommand.js";
import { updateAction } from "./src/commands/updateCommand.js";
import { doneAction } from "./src/commands/doneCommand.js";
import { deleteAction } from "./src/commands/deleteCommand.js";
import { undoAction } from "./src/commands/undoCommand.js";
import { searchAction } from "./src/commands/searchCommand.js";
import { sortAction } from "./src/commands/sortCommand.js";
// assigning Commander to a variable
const program = new Command();

// setting up
program
    .name("taskninja")
    .description("A simple CLI application to manage your tasks")
    .version("1.1.7");

// use command 'add' with title + status + priority + dueDate + description and action
program
    .command('add')
    .alias('a')
    .description('Add a new task')
    .action(addAction);


// use command 'list' with optional status filter and action
program
    .command('list')
    .alias('ls')
    .description('List all tasks')
    .option('-s, --status <status>', 'Filter tasks by status (todo, in-progress, done)')
    .action( listAction );



// use command 'search' to find tasks by keyword in title or description
program
    .command('search [keyword]')
    .alias('sr')
    .option('-f, --find <keyword>', 'Keyword to search in title or description')
    .description('Search tasks by keyword in title or description')
    .action( searchAction );

// use command 'sort' to sort tasks by due date, priority, or status
program
    .command('sort')
    .alias('so')
    .option('--by <criteria>', 'Sort tasks by criteria (dueDate, priority, status)')
    .description('Sort tasks by due date, priority, or status')
    .action( sortAction );


// use command 'update' with task ID and action
program 
    .command('update')
    .alias('up')
    .description('Update a task by ==> ID <==')
    .action( updateAction );


// use command 'done' with task ID instead of 'update' + confirm to mark task as done
program
    .command('done')
    .description('Mark a task as done by ==> ID <==')
    .action( doneAction );



// use command 'delete' with task ID and action
program
    .command('delete')
    .alias('del')
    .description('delete a task by ==> ID <==')
    .action( deleteAction );

// use command 'undo' to restore last deleted task
program
.command('undo')
.alias('un')
.description('Undo the last deleted task')
.action( undoAction );



// parse command line arguments
program.parse(process.argv);
