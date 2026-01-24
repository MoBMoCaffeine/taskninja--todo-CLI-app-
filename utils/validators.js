
// allowed task statuses
const ALLOWED_STATUSES = ["todo", "in-progress", "done"];
// allowed task priorities
const ALLOWED_PRIORITIES = ["low", "medium", "high"];

// validate task status
export const validateStatus = (status) => {
    if (!ALLOWED_STATUSES.includes(status)) {
        throw new Error(`Invalid status. Allowed statuses are: ${ALLOWED_STATUSES.join(", ")}`);
    }
};
// validate task priority
export const validatePriority = (priority) => {
    if (!ALLOWED_PRIORITIES.includes(priority)) {
        throw new Error(`Invalid priority. Allowed priorities are: ${ALLOWED_PRIORITIES.join(", ")}`);
    }  
};
// verify due date format
export const validateDueDate = (dueDate) => {
    if (isNaN(Date.parse(dueDate))) {
        throw new Error("Invalid due date. Please use a valid date format (YYYY-MM-DD).");
    }
};

export { ALLOWED_PRIORITIES, ALLOWED_STATUSES };
