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
