export type Message = {
	id: string;
	role: 'user' | 'assistant';
	content: string;
	timestamp: Date;
	hasToolCalls?: boolean;
	isSlashCommand?: boolean;
	slashCommand?: string;
	isStreaming?: boolean;
};

export type SlashCommand = {
	command: string;
	description: string;
	example: string;
};

export type TokenUsage = {
	inputTokens: number;
	outputTokens: number;
	reasoningTokens?: number;
	totalTokens: number;
};

export type ToolCall = {
	id: string;
	type: 'function';
	function: {
		name: string;
		arguments: string;
	};
};

export type ToolResult = {
	toolCallId: string;
	result: any;
	error?: string;
};

export type FileEditTool = {
	name: 'read_file' | 'write_file' | 'edit_file' | 'list_files';
	description: string;
	parameters: {
		type: 'object';
		properties: Record<string, any>;
		required: string[];
	};
};
