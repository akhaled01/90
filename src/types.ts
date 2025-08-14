export type Message = {
	id: string;
	role: 'user' | 'assistant';
	content: string;
	timestamp: Date;
	hasToolCalls?: boolean;
	isSlashCommand?: boolean;
	slashCommand?: string;
};

export type SlashCommand = {
	command: string;
	description: string;
	example: string;
};
