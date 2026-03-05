import chalk from "chalk";
import { loadTasks } from "../utils/taskService.js";
import { displayTasks, cleanupAndExit } from "../helpers/helpers.js";
import { ALLOWED_STATUSES } from "../utils/validators.js";

export const listAction = async (options) => {
    let tasks = await loadTasks();

    if (options.status) {
        if (!ALLOWED_STATUSES.includes(options.status)) {
            console.log(chalk.red(`Invalid status filter. Allowed statuses are: ${ALLOWED_STATUSES.join(", ")}`));
            cleanupAndExit(0);
        }
        tasks = tasks.filter(task => task.status === options.status);
    }
    
    displayTasks(tasks);
    cleanupAndExit(0);
};