import inquirer from "inquirer";
import chalk from "chalk";
import { loadTasks } from "../utils/taskService.js";
import { displayTasks, cleanupAndExit } from "../helpers/helpers.js";

export const sortAction = async (options) => {
    try {
        const tasks = await loadTasks();
        let criteria = options.by;

        if (!criteria) {
            const answer = await inquirer.prompt([
                { type: 'rawlist', name: 'criteria', message: 'Sort tasks by:', choices: ['dueDate', 'priority', 'status'] }
            ]);
            criteria = answer.criteria;
        }
        
        criteria = criteria.toLowerCase().replace(/[-_]/g, '');
        
        if (!['duedate', 'priority', 'status'].includes(criteria)) {
            console.log(chalk.red('Invalid sort criteria. Use --by with dueDate, priority, or status.'));
            return;
        }
        
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
        }

        displayTasks(sortedTasks);
    } catch (error) {
        console.log(chalk.yellow('\nOperation Cancelled!'));
    } finally {
        cleanupAndExit(0);
    }
};