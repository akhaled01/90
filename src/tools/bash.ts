import { tool } from 'ai';
import { exec } from 'child_process';
import { z } from 'zod';

export const bashTool = tool({
	name: 'bash',
	description: 'Run a bash command',
	inputSchema: z.object({
		command: z.string().describe('The bash command to run'),
	}),
	execute: async ({ command }) => {
		return new Promise((resolve, reject) => {
			exec(command, (error, stdout, stderr) => {
				if (error) {
					return reject(error);
				}
				resolve({ stdout, stderr });
			});
		});
	},
});