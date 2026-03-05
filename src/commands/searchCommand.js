import inquirer from "inquirer";
import chalk from "chalk";
import { loadTasks } from "../utils/taskService.js";
import { displayTasks, cleanupAndExit } from "../helpers/helpers.js";

export const searchAction = async (keyword, options) => {
    try {
        const tasks = await loadTasks();
        let searchTerm = keyword || options.find;

        if (!searchTerm) {
            const answers = await inquirer.prompt([
                { type: 'input', name: 'term', message: 'Enter the keyword you want to search for:', validate: input => input ? true : 'Keyword cannot be empty!' },
                { type: 'rawlist', name: 'field', message: 'Where do you want to search?', choices: ['title', 'description', 'both'], default: 'both' }
            ]);
            searchTerm = answers.term;
            const field = answers.field;

            const founded = tasks.filter(task => {
                if (field === 'title') return task.title.toLowerCase().includes(searchTerm.toLowerCase());
                if (field === 'description') return task.description.toLowerCase().includes(searchTerm.toLowerCase());
                return task.title.toLowerCase().includes(searchTerm.toLowerCase()) || task.description.toLowerCase().includes(searchTerm.toLowerCase());
            });

            if (!founded.length) {
                console.log(chalk.red('No task matched your search!'));
                return;
            }
            displayTasks(founded);
            return;
        }

        const founded = tasks.filter(task =>
            task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.description.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (!founded.length) {
            console.log(chalk.red('No task matched your search!'));
            return;
        }
        displayTasks(founded);
    } catch (error) {
        console.log(chalk.yellow('\nOperation Cancelled!'));
    } finally {
        cleanupAndExit(0);
    }
};