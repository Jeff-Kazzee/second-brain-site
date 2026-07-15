```markdown
# second-brain-site Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill covers the development patterns and conventions used in the `second-brain-site` TypeScript codebase. It documents file naming, import/export styles, commit conventions, and testing patterns, providing clear examples and suggested commands for common workflows. This guide is designed to help contributors quickly get up to speed and maintain consistency across the project.

## Coding Conventions

### File Naming
- Use **camelCase** for file names.
  - Example: `userProfile.ts`, `noteManager.ts`

### Import Style
- Use **alias imports** to reference modules.
  - Example:
    ```typescript
    import { NoteService } from '@/services/noteService';
    ```

### Export Style
- Mixed usage of default and named exports.
  - Example (named export):
    ```typescript
    export function getNotes() { ... }
    ```
  - Example (default export):
    ```typescript
    export default NoteManager;
    ```

### Commit Message Patterns
- Use the `feat` prefix for new features.
- Commit messages are typically around 90 characters.
  - Example:
    ```
    feat: add support for tagging notes and filtering by tag in the dashboard
    ```

## Workflows

### Adding a New Feature
**Trigger:** When implementing a new functionality.
**Command:** `/add-feature`

1. Create a new TypeScript file using camelCase naming.
2. Implement the feature using alias imports as needed.
3. Export your module (default or named as appropriate).
4. Write corresponding tests in a `*.test.*` file.
5. Commit with a message starting with `feat:`.

### Writing and Running Tests
**Trigger:** When adding or updating tests.
**Command:** `/run-tests`

1. Write test files using the `*.test.*` pattern (e.g., `noteManager.test.ts`).
2. Use the project's preferred testing framework (unspecified; check project docs or package.json).
3. Run the test suite using the appropriate command (e.g., `npm test` or `yarn test`).

### Importing Modules
**Trigger:** When you need to use code from another file.
**Command:** `/import-module`

1. Use alias imports to reference modules.
   ```typescript
   import { SomeUtil } from '@/utils/someUtil';
   ```

## Testing Patterns

- Test files follow the `*.test.*` naming convention (e.g., `noteManager.test.ts`).
- The specific testing framework is not specified; check the project documentation or dependencies.
- Place tests alongside the code or in a dedicated `tests` directory as per project structure.

## Commands

| Command        | Purpose                                         |
|----------------|-------------------------------------------------|
| /add-feature   | Start the workflow for adding a new feature     |
| /run-tests     | Run the project's test suite                    |
| /import-module | Show example of alias import usage              |
```
