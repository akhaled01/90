import { tool } from 'ai';
import { readFile, writeFile, readdir, stat, copyFile, rename, rm, mkdir, access, constants } from 'fs/promises';
import { join, dirname } from 'path';
import { z } from 'zod';

export const fsTools = {
	readFile: tool({
		description: 'Read the contents of a file',
		inputSchema: z.object({
			path: z.string().describe('The file path to read'),
		}),
		execute: async ({ path }) => {
			try {
				const content = await readFile(path, 'utf-8');
				return { success: true, content };
			} catch (error) {
				return { success: false, error: (error as Error).message };
			}
		},
	}),

	writeFile: tool({
		description: 'Write content to a file',
		inputSchema: z.object({
			path: z.string().describe('The file path to write to'),
			content: z.string().describe('The content to write'),
		}),
		execute: async ({ path, content }) => {
			try {
				await writeFile(path, content, 'utf-8');
				return { success: true };
			} catch (error) {
				return { success: false, error: (error as Error).message };
			}
		},
	}),

	readDirectory: tool({
		description: 'List the contents of a directory',
		inputSchema: z.object({
			path: z.string().describe('The directory path to read'),
		}),
		execute: async ({ path }) => {
			try {
				const items = await readdir(path);
				const itemsWithStats = await Promise.all(
					items.map(async (item) => {
						const itemPath = join(path, item);
						const stats = await stat(itemPath);
						return {
							name: item,
							path: itemPath,
							isDirectory: stats.isDirectory(),
							isFile: stats.isFile(),
							size: stats.size,
							modified: stats.mtime,
						};
					})
				);
				return { success: true, items: itemsWithStats };
			} catch (error) {
				return { success: false, error: (error as Error).message };
			}
		},
	}),

	copyFile: tool({
		description: 'Copy a file from source to destination',
		inputSchema: z.object({
			source: z.string().describe('The source file path'),
			destination: z.string().describe('The destination file path'),
		}),
		execute: async ({ source, destination }) => {
			try {
				// Ensure destination directory exists
				const destDir = dirname(destination);
				await mkdir(destDir, { recursive: true });
				await copyFile(source, destination);
				return { success: true };
			} catch (error) {
				return { success: false, error: (error as Error).message };
			}
		},
	}),

	moveFile: tool({
		description: 'Move or rename a file/directory from source to destination',
		inputSchema: z.object({
			source: z.string().describe('The source file or directory path'),
			destination: z.string().describe('The destination file or directory path'),
		}),
		execute: async ({ source, destination }) => {
			try {
				// Ensure destination directory exists
				const destDir = dirname(destination);
				await mkdir(destDir, { recursive: true });
				await rename(source, destination);
				return { success: true };
			} catch (error) {
				return { success: false, error: (error as Error).message };
			}
		},
	}),

	deleteFile: tool({
		description: 'Delete a file or directory (recursively)',
		inputSchema: z.object({
			path: z.string().describe('The file or directory path to delete'),
			recursive: z.boolean().optional().describe('Whether to delete directories recursively (default: true)'),
		}),
		execute: async ({ path, recursive = true }) => {
			try {
				await rm(path, { recursive, force: true });
				return { success: true };
			} catch (error) {
				return { success: false, error: (error as Error).message };
			}
		},
	}),

	createDirectory: tool({
		description: 'Create a directory (and parent directories if needed)',
		inputSchema: z.object({
			path: z.string().describe('The directory path to create'),
		}),
		execute: async ({ path }) => {
			try {
				await mkdir(path, { recursive: true });
				return { success: true };
			} catch (error) {
				return { success: false, error: (error as Error).message };
			}
		},
	}),

	fileExists: tool({
		description: 'Check if a file or directory exists',
		inputSchema: z.object({
			path: z.string().describe('The file or directory path to check'),
		}),
		execute: async ({ path }) => {
			try {
				await access(path, constants.F_OK);
				return { success: true, exists: true };
			} catch (error) {
				return { success: true, exists: false };
			}
		},
	}),

	getFileStats: tool({
		description: 'Get detailed information about a file or directory',
		inputSchema: z.object({
			path: z.string().describe('The file or directory path to get stats for'),
		}),
		execute: async ({ path }) => {
			try {
				const stats = await stat(path);
				return {
					success: true,
					stats: {
						isFile: stats.isFile(),
						isDirectory: stats.isDirectory(),
						size: stats.size,
						created: stats.birthtime,
						modified: stats.mtime,
						accessed: stats.atime,
						permissions: stats.mode,
					},
				};
			} catch (error) {
				return { success: false, error: (error as Error).message };
			}
		},
	}),
};
