import inquirer from "inquirer";
import chalk from "chalk";
import { loadTasks, saveTasks } from "../utils/taskService.js";
import { displayTasks, cleanupAndExit } from "../helpers/helpers.js";
import { validateDueDate, ALLOWED_PRIORITIES, ALLOWED_STATUSES } from "../utils/validators.js";

export const updateAction = async () => {
    try {
        const tasks = await loadTasks();
        if (!tasks.length) {
            console.log(chalk.red('No tasks found to update.'));
            cleanupAndExit(0);
        }
        
        const { id } = await inquirer.prompt([
            {
                type: 'rawlist',
                name: 'id',
                message: 'Select the task to update (By ID):',
                choices: tasks.map(task => ({ name: `${task.id}: ${task.title}`, value: task.id }))
            }
        ]);

        const task = tasks.find(t => t.id === Number(id));
        
        const answers = await inquirer.prompt([
            { type: 'confirm', name: 'changeTitle', message: 'Do you want to change the title?', default: false },
            { type: 'input', name: 'title', message: 'Enter the new title:', when: a => a.changeTitle, validate: input => input ? true : 'Title cannot be empty!' },
            { type: 'confirm', name: 'changeStatus', message: 'Do you want to change the status?', default: false },
            { type: 'rawlist', name: 'status', message: 'Select the new status:', choices: ALLOWED_STATUSES, when: a => a.changeStatus },
            { type: 'confirm', name: 'changePriority', message: 'Do you want to change the priority?', default: false },
            { type: 'rawlist', name: 'priority', message: 'Select the new priority:', choices: ALLOWED_PRIORITIES, when: a => a.changePriority },
            { type: 'confirm', name: 'changeDueDate', message: 'Do you want to change the due date?', default: false },
            {
                type: 'input', name: 'dueDate', message: 'Enter the new due date (YYYY-MM-DD):', when: a => a.changeDueDate,
                validate: input => { try { validateDueDate(input); return true; } catch (error) { return error.message; } }
            },
            { type: 'confirm', name: 'changeDescription', message: 'Do you want to change the description?', default: false },
            { type: 'input', name: 'description', message: 'Enter the new description:', when: a => a.changeDescription }
        ]);

        if (answers.changeTitle) task.title = answers.title;
        if (answers.changeStatus) task.status = answers.status;
        if (answers.changePriority) task.priority = answers.priority;
        if (answers.changeDueDate) task.dueDate = answers.dueDate;
        if (answers.changeDescription) task.description = answers.description || '';

        const hasChanges = [answers.changeTitle, answers.changeStatus, answers.changePriority, answers.changeDueDate, answers.changeDescription].some(Boolean);

        if (!hasChanges) {
            console.log(chalk.yellow('No changes were made.'));
        } else {
            await saveTasks(tasks);
            console.log(chalk.green('Task updated successfully!'));
        }
        displayTasks(tasks);
    } catch (error) {
        console.log(chalk.yellow('\nOperation Cancelled!'));
    } finally {
        cleanupAndExit(0);
    }
};