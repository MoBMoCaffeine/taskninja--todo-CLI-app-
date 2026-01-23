# TaskNinja

![TaskNinja Logo](https://via.placeholder.com/150?text=TaskNinja) <!-- Optional: Replace with actual logo if available -->

A simple Command-Line Interface (CLI) application built with JavaScript for managing your to-do tasks. It allows users to add, list, update, and delete tasks interactively, with features like status tracking, priority levels, due dates, and descriptions. Tasks are stored in a local JSON file for persistence.

This project is designed for developers and users who prefer a lightweight, terminal-based task manager without the need for complex setups or databases.

## Features

- **Add Tasks**: Create new tasks with title, status (todo, in-progress, done), priority (low, medium, high), due date, and optional description.
- **List Tasks**: View all tasks or filter by status in a tabular format.
- **Update Tasks**: Change the status of existing tasks via interactive selection.
- **Delete Tasks**: Remove tasks with confirmation to prevent accidental deletion.
- **Persistent Storage**: Tasks are saved to a local `todos.json` file.
- **Interactive Prompts**: Uses Inquirer for user-friendly input.
- **Validation**: Ensures valid statuses, priorities, and date formats.

## Technologies Used

- **Node.js**: Runtime environment.
- **Commander**: For parsing command-line arguments and defining commands.
- **Inquirer**: For interactive CLI prompts.
- **fs/promises**: For asynchronous file system operations to handle task storage.
- **ECMAScript Modules (ESM)**: Modern JavaScript module system.

The application is written in pure JavaScript (ES6+), with no additional frameworks or databases required.

## Installation

### From npm

TaskNinja is published on npm as `taskninja`. Install it globally to use the CLI commands from anywhere:

```bash
npm install -g taskninja
```

After installation, you can run the CLI using the `dotask` command (as defined in `package.json`).

### From Source

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/taskninja.git
   cd taskninja
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Link the CLI globally (optional, for testing):
   ```bash
   npm link
   ```

4. Run the application:
   ```bash
   npm start
   ```
   Or directly:
   ```bash
   node app.js
   ```

## Usage

Run the CLI with the `dotask` command (after global installation) or `node app.js` from the source.

### Commands

- **Add a Task**:
  ```bash
  dotask add
  ```
  - This will prompt you interactively for title, status, priority, due date, and description.
  - Example output: "Task added successfully!"

- **List Tasks**:
  ```bash
  dotask list
  ```
  - Lists all tasks in a table format.
  - Optional filter by status: `dotask list --status todo` (or `-s todo`).
  - Aliases: `dotask ls`.

- **Update a Task**:
  ```bash
  dotask update
  ```
  - Prompts to select a task by ID and update its status.
  - Displays the updated task in a table.
  - Aliases: `dotask up`.

- **Delete a Task**:
  ```bash
  dotask delete
  ```
  - Prompts to select a task by ID and confirm deletion.
  - Aliases: `dotask del`.

- **Help**:
  ```bash
  dotask --help
  ```
  - Shows all available commands and options.

- **Version**:
  ```bash
  dotask --version
  ```
  - Displays the current version (1.0.0).

### Examples

1. Adding a task:
   ```
   dotask add
   ```
   - Follow prompts: Enter "Buy groceries" as title, select "todo" status, "medium" priority, "2024-12-31" due date, and "Milk, eggs, bread" as description.

2. Listing tasks filtered by status:
   ```
   dotask list -s in-progress
   ```

3. Updating a task:
   ```
   dotask update
   ```
   - Select task ID from the list and choose new status (e.g., "done").

4. Deleting a task:
   ```
   dotask delete
   ```
   - Select task ID and confirm.

Tasks are stored in `./todos.json` relative to where the command is run. Ensure write permissions in the directory.

## Configuration

- **Task File**: Defaults to `./todos.json`. You can modify `TASKS_FILE` in `app.js` if needed.
- **Statuses**: Limited to "todo", "in-progress", "done".
- **Priorities**: Limited to "low", "medium", "high".
- **Due Date Format**: YYYY-MM-DD (validated during input).

No external configuration files are required.

## Development

To run in development mode:
```bash
npm run dev
```

This executes `node app.js` for quick testing.

### Scripts

- `npm start`: Runs the app.
- `npm test`: Placeholder for tests (currently errors out; add tests as needed).

## Contribution Guidelines

We welcome contributions to improve TaskNinja! Whether it's bug fixes, new features, or documentation enhancements, follow these steps:

### How to Contribute

1. **Fork the Repository**:
   - Go to the [GitHub repo](https://github.com/yourusername/taskninja) and click "Fork".

2. **Clone Your Fork**:
   ```bash
   git clone https://github.com/yourusername/taskninja.git
   cd taskninja
   ```

3. **Create a Branch**:
   - Use a descriptive name: `git checkout -b feature/new-feature` or `git checkout -b fix/bug-fix`.

4. **Make Changes**:
   - Follow the existing code style (ESLint can be added later for consistency).
   - Add or update tests if applicable.
   - Ensure your code handles errors gracefully and maintains validation logic.

5. **Commit Changes**:
   - Use clear commit messages: e.g., "feat: add search functionality" or "fix: resolve date validation issue".
   - Reference issues if relevant: e.g., "Closes #123".

6. **Push to Your Fork**:
   ```bash
   git push origin feature/new-feature
   ```

7. **Open a Pull Request (PR)**:
   - Go to the original repo and click "New Pull Request".
   - Provide a detailed description of your changes, including why they're needed and any relevant screenshots.
   - Link to any related issues.

### Guidelines

- **Code Style**: Use consistent indentation (2 spaces), semicolons, and follow ES6+ best practices.
- **Testing**: Add unit tests using a framework like Jest if expanding features. Currently, no tests are implemented—contributions here are encouraged!
- **Dependencies**: Keep them minimal. Justify any new additions.
- **Features**: New commands or options should align with the simple CLI philosophy. Discuss major changes in an issue first.
- **Documentation**: Update README.md with any new features or changes.
- **Issues**: Check for existing issues before creating a new one. Use labels like "bug", "enhancement", or "question".

### Code of Conduct

- Be respectful and inclusive.
- No harassment or discrimination.
- Report issues to the maintainer (Mohamed Bakr).

By contributing, you agree that your contributions will be licensed under the ISC License.

## License

This project is licensed under the ISC License.

## Author

- **Mohamed Bakr** - Just a Developer - [GitHub Profile](https://github.com/MoBMoCaffeine)

## Acknowledgments

- Inspired by simple CLI tools like Todoist CLI.
- Thanks to the open-source community for libraries like Commander and Inquirer.

If you encounter issues or have suggestions, open an issue on GitHub!