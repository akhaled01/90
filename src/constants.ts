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
];

export const mockResponses = [
	"I understand what you're asking. Here's my perspective:\n\n1. Start with the basics\n2. Build incrementally\n3. Test thoroughly\n\nLet me show you an example:",
	"Great point! I'd approach this differently:\n\n```diff\n- old approach\n+ new improved approach\n+ with better error handling\n```",
	"Here's what I found in the codebase:\n\n**Modified files:**\n- src/components/Button.tsx\n- src/utils/helpers.ts\n\n**Changes:**\n• Updated prop types\n• Added error boundaries\n• Improved accessibility",
	'Let me break this down step by step:\n\n□ Analyze requirements\n□ Design architecture\n□ Implement features\n□ Write tests\n□ Deploy changes\n\nEach step is crucial for success.',
	"Here's the file diff for your changes:\n\n```diff\n@@ -15,7 +15,10 @@\n function handleClick() {\n-  console.log('clicked');\n+  console.log('Button clicked');\n+  analytics.track('button_click');\n+  onButtonClick?.();\n }\n```",
];
