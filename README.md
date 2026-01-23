
# TaskNinja

**Version:** 1.0.4  
**Description:** A simple CLI To-Do Application to manage your tasks directly from the terminal.  

---

## Table of Contents
- [Installation](#installation)
- [Running the CLI](#running-the-cli)
- [Commands](#commands)
  - [Add Task](#add-task)
  - [List Tasks](#list-tasks)
  - [Update Task](#update-task)
  - [Delete Task](#delete-task)
- [Task Fields & Allowed Values](#task-fields--allowed-values)
- [Examples](#examples)

---

## Installation

### From npm

TaskNinja is published on npm as `taskninja`. Install it globally to use the CLI commands from anywhere:

```bash
npm install -g taskninja
```

or use it instantly with:
```bash
npx taskninja
```

and then use it:
```bash
npx taskninja <command>
```

After installation, you can run the CLI using the `dotask` or `taskninja` or `tn` command (as defined in `package.json`).

Clone the repository and install dependencies:

```bash
git clone <your-repo-url>
cd taskninja
npm install
````

---

## Running the CLI

You can run the CLI using either `node` or the bin aliases:

```bash
# Using node
node app.js <command>

# Using bin aliases
dotask <command>
taskninja <command>
tn <command>
```

Replace `<command>` with any of the available commands: `add`, `list`, `update`, `delete`.

---

## Commands

### 1. Add Task

**Alias:** `a`
**Description:** Add a new task interactively.

```bash
node app.js add
# or
tn a
```

**Prompts:**

1. **Task Title:** Enter any text (cannot be empty).
2. **Task Status:** Select from allowed values using arrows:

   * todo
   * in-progress
   * done
3. **Task Priority:** Select from allowed values using arrows:

   * low
   * medium
   * high
4. **Due Date:** Enter in `YYYY-MM-DD` format. Invalid dates will show a validation error.
5. **Description:** Optional text.

**Expected Behavior:**

* Task is saved in `todos.json`.
* Confirmation message: `Task added successfully!`

---

### 2. List Tasks

**Alias:** `ls`
**Description:** List all tasks, optionally filtered by status.

```bash
node app.js list
# or
tn ls
```

**Optional Status Filter:**

```bash
node app.js list --status todo
```

**Behavior:**

* Displays tasks in a table with columns:

| # | ID | Title | Status | Priority | DueDate | Description |
| - | -- | ----- | ------ | -------- | ------- | ----------- |

* Numbered index (`#`) starts from 1.

---

### 3. Update Task

**Alias:** `up`
**Description:** Update an existing task by selecting its ID.

```bash
node app.js update
# or
tn up
```

**Steps:**

1. Select task by ID from a list (use arrows).
2. Confirm which fields to change (title, status, priority, due date, description).
3. Enter new values where applicable (status/priority selections use arrows).

**Behavior:**

* Only fields selected for change are updated.
* Confirmation message: `Task updated successfully!`
* Shows updated task table.

---

### 4. Delete Task

**Alias:** `del`
**Description:** Delete a task by selecting its ID.

```bash
node app.js delete
# or
tn del
```

**Steps:**

1. Select task by ID from a list (use arrows).
2. Confirm deletion.

**Behavior:**

* Task is removed from `todos.json`.
* Confirmation message: `Task deleted successfully!`
* Shows updated task table.

---

## Task Fields & Allowed Values

| Field       | Allowed Values / Description |
| ----------- | ---------------------------- |
| title       | Any non-empty string         |
| status      | todo, in-progress, done      |
| priority    | low, medium, high            |
| dueDate     | YYYY-MM-DD                   |
| description | Optional text                |

---

## Examples

**Adding a Task:**

```bash
tn a
```

```
Task Title: Buy groceries
Task Status: → todo
Task Priority: → medium
Due Date (YYYY-MM-DD): 2026-02-01
Task Description (optional): Buy fruits and vegetables
```

**Listing Tasks:**

```bash
tn ls
```

```
┌─┬────┬────────────────┬─────────────┬─────────┬────────────┬─────────────────────────────┐
│#│ ID │ Title          │ Status      │ Priority│ DueDate    │ Description                 │
├─┼────┼────────────────┼─────────────┼─────────┼────────────┼─────────────────────────────┤
│1│ 1  │ Buy groceries  │ todo        │ medium  │ 2026-02-01 │ Buy fruits and vegetables  │
└─┴────┴────────────────┴─────────────┴─────────┴────────────┴─────────────────────────────┘
```

**Updating a Task:**

```bash
tn up
```

* Select task ID → confirm fields → update values
* Shows updated table.

**Deleting a Task:**

```bash
tn del
```

* Select task ID → confirm deletion → updated table shown

---

## Notes

* All selection prompts (`status`, `priority`, task selection) use arrow keys in terminal.
* Task table always shows numbered index (`#`) starting from 1 for easy reference.
