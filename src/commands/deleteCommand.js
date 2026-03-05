import inquirer from 'inquirer';
import chalk from 'chalk';
import { loadTasks, saveTasks, saveDeletedTask } from '../utils/taskService.js';
import { displayTasks, cleanupAndExit } from '../helpers/helpers.js';

export const deleteAction = async () => {
    try {
        const tasks = await loadTasks();
        if (!tasks.length) {
            console.log(chalk.yellow('No tasks found to delete.'));
            cleanupAndExit(0);
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
            console.log(chalk.yellow('Task deletion cancelled.'));
            cleanupAndExit(0);
        }
        
        const taskToDelete = tasks.find(t => t.id === Number(id));
        await saveDeletedTask(taskToDelete); 
        
        const newTasks = tasks.filter(t => t.id !== Number(id));
        await saveTasks(newTasks); 

        console.log(chalk.green('Task deleted successfully!'));
        console.log(chalk.cyan('You can undo this action by using the `undo` command.'));
        displayTasks(newTasks);
    } catch (error) {
        console.log(chalk.yellow('\nOperation Cancelled!'));
    } finally {
        cleanupAndExit(0);
    }
};