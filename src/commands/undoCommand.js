import chalk from 'chalk';
import { loadTasks, saveTasks, loadDeletedTasks, saveDeletedTasksFile, cleanupExpiredDeletedTasks } from '../utils/taskService.js';
import { cleanupAndExit } from '../helpers/helpers.js';

export const undoAction = async () => {
    try {
        await cleanupExpiredDeletedTasks();

        const deletedTasks = await loadDeletedTasks();
        if (!deletedTasks || deletedTasks.length === 0) {
            console.log(chalk.yellow('No deleted task to restore.'));
            return;
        }

        const lastDeletedTask = deletedTasks.pop();

        const { deletedAt, expiredAfter, ...cleanTask } = lastDeletedTask;

        const tasks = await loadTasks();
        tasks.push(cleanTask); 
        tasks.sort((a, b) => a.id - b.id); 
        await saveTasks(tasks);

        await saveDeletedTasksFile(deletedTasks);

        console.log(chalk.green(`Last deleted task restored successfully! (Task name: ${cleanTask.title})`));
    } catch (error) {
        console.log(chalk.red('An error occurred during undo operation.'));
    } finally {
        cleanupAndExit(0);
    }
};