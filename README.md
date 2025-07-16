# Cobld

Cobld is a command-line interface (CLI) tool designed to simplify the process of building context for Large Language Models (LLMs). It allows you to select files, provide instructions, and generate a combined prompt that is automatically copied to your clipboard.

---

## Features

- **Interactive UI**: A terminal-based interface built with Ink that allows for easy navigation and selection.
- **Multiple Modes**:
  - **Code Mode**: Select specific files from your git repository, add an instruction, and generate a prompt containing the content of those files for code-related queries.
  - **Git Commit Mode**: Automatically uses your staged git changes to generate a commit message prompt, with an option to add further instructions.
- **File Filtering**: Search through files in your repository to quickly find the ones you need.
- **Dynamic Shortcuts**: The tool displays available keyboard shortcuts that change based on the current context.
- **Clipboard Integration**: Generated prompts are automatically copied to your clipboard for immediate use.

---

## Inspiration

`cobld` is inspired by:

- **[aider](https://aider.chat)**, which allows you to manage context manually.
- **[poorcoder](https://github.com/Strawberry-Computer/poorcoder)**, which is copy-and-paste based.

`cobld` combines these ideas into a single, streamlined workflow.

---

## Usage

To start the application, run the `npx cobld` command in your terminal within a git repository:

```bash
npx cobld
```

The interface is divided into several sections that you can navigate using your keyboard.

### General Navigation

- **`[0]`**: Return to the **Mode** selection.
- **`[1]`, `[2]`, ...**: Jump to a specific section (e.g., Files, Instruction).
- **`ctrl-q`**: Quit the application.
- **`enter`**: Submit the form and generate the prompt.

### Mode Selection

- **`↑/↓`**: Navigate between available modes (`Code`, `Git Commit`).
- **`space`**: Select the highlighted mode.

### Files Section (Code Mode)

- **`↑/↓`**: Navigate the file list.
- **`space`**: Toggle selection for a single file.
- **`ctrl-a`**: Toggle selection for all currently filtered files.
- **`/`**: Enter search mode to filter files.
- **`esc`**: Exit search mode.

### Instruction Section

- **`esc`**: Return to the mode selection view.
- **`ctrl-r`**: Reset the input field.

---

## Development

To set up the project for local development:

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/ericc-ch/cobld.git
    cd cobld
    ```

2.  **Install dependencies (using bun):**

    ```bash
    bun install
    ```

3.  **Run in development mode:**
    This will watch for file changes and rebuild automatically.

    ```bash
    bun run dev
    ```

### Other Scripts

- **`bun run build`**: Build the project for production.
- **`bun run lint`**: Lint the codebase.
- **`bun run test`**: Run tests.
- **`bun run typecheck`**: Check for TypeScript errors.
