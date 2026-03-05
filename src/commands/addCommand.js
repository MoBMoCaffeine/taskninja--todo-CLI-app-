import inquirer from "inquirer";
import chalk from "chalk";
import { loadTasks, saveTasks, getNextId } from "../utils/taskService.js";
import { validateDueDate, ALLOWED_PRIORITIES, ALLOWED_STATUSES } from "../utils/validators.js";
import { cleanupAndExit } from '../helpers/helpers.js';

export const addAction = async () => {
    try {
        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'Task Title:',
                validate: input => input ? true : 'Title cannot be empty!'
            },
            {
                type: 'rawlist',
                name: 'status',
                message: 'Task Status:',
                choices: ALLOWED_STATUSES,
                default: 'todo'
            },
            {
                type: 'rawlist',
                name: 'priority',
                message: 'Task Priority:',
                choices: ALLOWED_PRIORITIES,
                default: 'medium'
            },
            {
                type: 'input',
                name: 'dueDate',
                message: 'Due Date (YYYY-MM-DD):',
                default: () => {
                    const today = new Date();
                    return today.toISOString().split('T')[0];
                },
                filter: (input) => {
                    const trimmed = input.trim();
                    if (!trimmed) {
                        return new Date().toISOString().split('T')[0];
                    }
                    return trimmed;
                },
                validate: input => {
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
                message: 'Task Description (optional):'    
            },
        ]);

        const tasks = await loadTasks();
        const newTask = {
            id: getNextId(tasks),
            title: answers.title,
            status: answers.status,
            priority: answers.priority,
            dueDate: answers.dueDate,
            description: answers.description || ''
        };

        tasks.push(newTask);
        await saveTasks(tasks);
        console.log(chalk.green('Task added successfully!'));
    } catch (error) {
        console.log(chalk.yellow('\nOperation Cancelled!'));
    } finally {
        cleanupAndExit(0);
    }
};