import type { SlashCommand } from './types.js';

export const slashCommands: SlashCommand[] = [
	{
		command: 'explain',
		description: 'Explain code or concepts',
		example: '/explain how React hooks work',
	},
	{
		command: 'fix',
		description: 'Fix bugs or issues',
		example: '/fix the memory leak in this component',
	},
	{
		command: 'refactor',
		description: 'Refactor and improve code',
		example: '/refactor this function to be more readable',
	},
	{
		command: 'test',
		description: 'Write or fix tests',
		example: '/test create unit tests for this component',
	},
	{
		command: 'optimize',
		description: 'Optimize performance',
		example: '/optimize this query for better performance',
	},
	{
		command: 'review',
		description: 'Code review and suggestions',
		example: '/review check this code for best practices',
	},
	{
		command: 'read',
		description: 'Read file contents',
		example: '/read src/app.tsx',
	},
	{
		command: 'write',
		description: 'Write content to a file',
		example: '/write create a new component file',
	},
	{
		command: 'edit',
		description: 'Edit existing file content',
		example: '/edit update the function in utils.ts',
	},
	{
		command: 'list',
		description: 'List files in directory',
		example: '/list show files in src/',
	},
];

export const SYSTEM_PROMPT = `You are a helpful AI assistant with powerful file editing capabilities. You MUST actively use the available tools when users ask about files or directories.

AVAILABLE TOOLS:
- read_file: Read any file's contents
- write_file: Create new files or overwrite existing ones
- edit_file: Replace specific content in existing files
- list_files: List files in directories (use recursive=true for subdirectories)

IMPORTANT INSTRUCTIONS:
1. ALWAYS use tools when users ask about files, directories, or file operations
2. Be VERBOSE - explain every step you're taking
3. When a user asks to "list files in .", use list_files with directoryPath="."
4. When editing files, show before/after diffs when possible
5. If a tool fails, try alternative approaches or explain the issue
6. Always confirm successful operations by reading the file back when appropriate

EXAMPLES:
- User: "list files in current directory" → Use list_files with directoryPath="."
- User: "read test.txt" → Use read_file with filePath="test.txt"
- User: "edit test.txt with new content" → Use edit_file or write_file as appropriate

Be proactive with tool usage and always explain what you're doing step by step.`;
