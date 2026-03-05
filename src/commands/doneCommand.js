import inquirer from "inquirer";
import chalk from "chalk";
import { loadTasks, saveTasks } from "../utils/taskService.js";
import { displayTasks, cleanupAndExit } from "../helpers/helpers.js";

export const doneAction = async () => {
    try {
        const tasks = await loadTasks();
        const activeTasks = tasks.filter(t => t.status !== 'done');
        
        if (!activeTasks.length) {
            console.log(chalk.magenta('Congratulations! All tasks are already done.'));
            return;
        }
        
        const { id } = await inquirer.prompt([
            {
                type: 'rawlist',
                name: 'id',
                message: 'Select the task to mark as done:',
                choices: activeTasks.map(t => ({ name: `${t.id}: ${t.title} [Current Status: ${t.status}]`, value: t.id }))
            }
        ]);

        const task = tasks.find(t => t.id === Number(id));
        task.status = 'done';
        await saveTasks(tasks);
        
        console.log(chalk.green('Task marked as done successfully!'));
        displayTasks(tasks);
    } catch (error) {
        console.log(chalk.yellow('\nOperation Cancelled!'));
    } finally {
        cleanupAndExit(0);
    }
};