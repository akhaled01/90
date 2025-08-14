import React, {useState, useCallback} from 'react';
import {Box, useInput, useApp} from 'ink';
import {Message, TokenUsage} from './types.js';
import {slashCommands, SYSTEM_PROMPT} from './constants.js';
import {
	MessageList,
	SlashCommandMenu,
	MultilineInput,
	InlineMetadata,
	StatusBar,
} from './components/index.js';
import {createOpenRouter} from '@openrouter/ai-sdk-provider';
import {stepCountIs, streamText} from 'ai';
import {config} from 'dotenv';
import {fsTools} from './tools/fs.js';
import {bashTool} from './tools/bash.js';

config({debug: false});

export default function App() {
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [tokenUsage, setTokenUsage] = useState<TokenUsage>({
		inputTokens: 0,
		outputTokens: 0,
		reasoningTokens: 0,
		totalTokens: 0,
	});
	const [showSlashMenu, setShowSlashMenu] = useState(false);
	const [selectedCommandIndex, setSelectedCommandIndex] = useState(0);
	const {exit} = useApp();

	const openrouter = createOpenRouter({
		apiKey: process.env['OPENROUTER_API_KEY'],
	});

	// Check if input should trigger slash menu (starts with / and only contains whitespace after)
	const shouldShowSlashMenu = (input: string) => {
		if (!input.startsWith('/')) return false;
		const afterSlash = input.slice(1);
		return (
			afterSlash.trim() === '' ||
			afterSlash === afterSlash.replace(/[^\s]/g, '')
		);
	};

	// Filter commands based on current input
	const getFilteredCommands = () => {
		if (!showSlashMenu || !shouldShowSlashMenu(input)) return [];

		// Extract search term after the '/' (trim whitespace for filtering)
		const searchTerm = input.slice(1).trim().toLowerCase();
		if (searchTerm === '') return slashCommands;

		return slashCommands.filter((cmd: any) =>
			cmd.command.toLowerCase().includes(searchTerm),
		);
	};

	const filteredCommands = getFilteredCommands();

	const addMessage = useCallback(
		(
			role: 'user' | 'assistant',
			content: string,
			hasToolCalls?: boolean,
			isSlashCommand?: boolean,
			slashCommand?: string,
			isStreaming?: boolean,
		) => {
			const message: Message = {
				id: Math.random().toString(36).substring(2, 11),
				role,
				content,
				timestamp: new Date(),
				hasToolCalls,
				isSlashCommand,
				slashCommand,
				isStreaming,
			};
			setMessages(prev => [...prev, message]);
		},
		[],
	);

	const updateLastMessage = useCallback(
		(content: string, isStreaming?: boolean) => {
			setMessages(prev => {
				if (prev.length === 0) return prev;
				const lastMessage = prev[prev.length - 1];
				if (!lastMessage) return prev;
				const updatedMessage: Message = {
					...lastMessage,
					content,
					isStreaming: isStreaming ?? lastMessage.isStreaming,
				};
				return [...prev.slice(0, -1), updatedMessage];
			});
		},
		[],
	);

	const streamResponse = useCallback(
		async (userMessage: string) => {
			// Add initial empty assistant message
			addMessage('assistant', '', false, false, undefined, true);

			try {
				const result = streamText({
					model: openrouter('openai/gpt-oss-20b'),
					messages: [
						{
							role: 'system',
							content: SYSTEM_PROMPT,
						},
						{
							role: 'user',
							content: userMessage,
						},
					],
					tools: { ...fsTools, bash: bashTool },
					stopWhen: stepCountIs(20),
				});

				let currentContent = '';

				// Handle both tool calls and text streaming
				for await (const delta of result.textStream) {
					currentContent += delta;
					updateLastMessage(currentContent, true);
				}

				// Mark streaming as complete and get final usage data
				updateLastMessage(currentContent, false);
				setIsLoading(false);

				// Get actual token usage from the result
				const usage = await result.usage;
				if (usage) {
					setTokenUsage(prev => ({
						inputTokens: prev.inputTokens + (usage.inputTokens || 0),
						outputTokens: prev.outputTokens + (usage.outputTokens || 0),
						reasoningTokens:
							(prev.reasoningTokens || 0) + (usage.reasoningTokens || 0),
						totalTokens: prev.totalTokens + (usage.totalTokens || 0),
					}));
				}
			} catch (error) {
				console.error('Streaming error:', error);
				updateLastMessage(
					'Sorry, there was an error processing your request.',
					false,
				);
				setIsLoading(false);
			}
		},
		[addMessage, updateLastMessage],
	);

	const sendMessage = useCallback(
		async (slashCommand?: string) => {
			if (slashCommand) {
				// Handle slash command - don't send a message, just execute the command
				console.log(`Executing slash command: /${slashCommand}`);
				// TODO: Add actual slash command logic here
				return;
			} else {
				if (!input.trim() || isLoading) return;

				const userMessage = input.trim();
				setInput('');
				addMessage('user', userMessage);
				setIsLoading(true);

				// Start streaming response immediately
				await streamResponse(userMessage);
			}
		},
		[input, isLoading, addMessage, streamResponse],
	);

	useInput((inputKey: string, key: any) => {
		if (key.ctrl && inputKey === 'c') {
			exit();
		}
	});

	return (
		<Box flexDirection="column" height="100%" padding={1}>
			<Box flexDirection="column" flexGrow={1} marginBottom={1}>
				<MessageList messages={messages} />
			</Box>

			<InlineMetadata
				tokenCount={tokenUsage}
				messages={messages}
				isLoading={isLoading}
			/>

			<Box borderStyle="round" borderColor="gray" padding={1}>
				<MultilineInput
					value={input}
					onChange={setInput}
					onSubmit={sendMessage}
					isLoading={isLoading}
					showSlashMenu={showSlashMenu}
					setShowSlashMenu={setShowSlashMenu}
					selectedCommandIndex={selectedCommandIndex}
					setSelectedCommandIndex={setSelectedCommandIndex}
					filteredCommands={filteredCommands}
				/>
			</Box>

			<StatusBar />

			{showSlashMenu && filteredCommands.length > 0 ? (
				<SlashCommandMenu
					commands={filteredCommands}
					selectedIndex={selectedCommandIndex}
				/>
			) : null}
		</Box>
	);
}
