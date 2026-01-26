// for file system operations
import fs from "fs/promises";


// file to store tasks
const TASKS_FILE = "./todos.json";

// file to temporarily store deleted tasks for undo functionality
export const DELETED_TASKS_FILE = "./deleted_todos.json";


/**
 * @description this section responsible to store tasks in todo.json
 */
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

/**
 * @description this section responsible to store deleted tasks in deleted_todos.json
 * for undo functionality
 */

// to load deleted last-deleted task
export const loadDeletedTask = async () => {
    try {
        const data = await fs.readFile(DELETED_TASKS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') return null;
        throw error;
    }
};
// to save deleted last-deleted task
export const saveDeletedTask = async (task, expiredAfter = 60000) => {
    const deletedTask = await loadDeletedTask(task) || [];
    const now = Date.now();

    deletedTask.push({
        ...task,
        deletedAt: now, 
        expiredAfter
    });

    await fs.writeFile(DELETED_TASKS_FILE, JSON.stringify(deletedTask, null, 2));
}

// function to delete all deleted-tasks after a while
export const cleanupExpiredDeletedTasks = async () => {
    const deletedTasks = await loadDeletedTask() || [];
    const now = Date.now();

    const remaining = deletedTasks.filter(task => now - task.deletedAt < task.expiredAfter);
    if (remaining.length !== deletedTasks.length){
        await fs.writeFile(DELETED_TASKS_FILE, JSON.stringify(remaining, null, 2));
    }
}

// to clear deleted tasks file after undo
export const clearDeletedTask = async () => {
    try {
        await fs.unlink(DELETED_TASKS_FILE);
    } catch (error) {
        if (error.code !== 'ENOENT') {
            throw error;
        }
    }
};
