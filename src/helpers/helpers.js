
// supporting colors in table forms
import Table from 'cli-table3';
// for colored text 
import chalk from 'chalk';
// for reading keyboard buttons
import readline from 'readline';

// helper function to display tasks in colored table
const displayTasks = (tasks) => {
    if (!tasks.length) {
        console.log(chalk.yellow("No tasks to display."));
        cleanupAndExit(0);
    }

    const table = new Table({
        head:  [
        chalk.cyanBright('#'),
        chalk.cyanBright('ID'),
        chalk.cyanBright('Title'),
        chalk.cyanBright('Status'),
        chalk.cyanBright('Priority'),
        chalk.cyanBright('DueDate'),
        chalk.cyanBright('Description')
    ],
        colWidths: [4, 4, 20, 15, 10, 12, 45]
    });

    tasks.forEach((task, index) => {
        table.push([
            index + 1,
            task.id,
            task.title,
            task.status === "done" ? chalk.green(task.status)
            : task.status === "in-progress" ? chalk.yellow(task.status)
            : chalk.blue(task.status),
            task.priority === "high" ? chalk.red(task.priority)
            : task.priority === "medium" ? chalk.yellow(task.priority)
            : chalk.green(task.priority),
            task.dueDate,
            task.description || ''
        ]);
    });

    console.log(table.toString());
};

const cleanupAndExit = (code = 0) => {
    if (process.stdin.isTTY) {
        process.stdin.setRawMode(false);
    }
    process.exit(code);
};

const enableEscExit = () => {
    readline.emitKeypressEvents(process.stdin);

    if (process.stdin.isTTY) {
        process.stdin.setRawMode(true);
    }

    process.stdin.on('keypress', (_, key) => {
        if (key?.name === 'escape'){
            console.log(chalk.yellow('\nOperation Cancelled!'));
            cleanupAndExit(0);
        }
    });
};

export {displayTasks, enableEscExit, cleanupAndExit};