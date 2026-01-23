// for file system operations
import fs from "fs/promises";


// file to store tasks
const TASKS_FILE = "./todos.json";

// function to load tasks from file
export const loadTasks = async () => {
    try{
        const data = await fs.readFile(TASKS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') return [];
        throw error;
    }
};
// function to save tasks to file
export const saveTasks = async (tasks) => {
    await fs.writeFile(TASKS_FILE, JSON.stringify(tasks, null, 2));
};
// get next task ID
export const getNextId = (tasks) => {
    return tasks.length > 0 ? Math.max(...tasks.map(task => task.id)) + 1 : 1;
};
