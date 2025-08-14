import React, {useState, useCallback} from 'react';
import {Box, useInput, useApp} from 'ink';
import { Message } from './types.js';
import { slashCommands } from './constants.js';
import { getRandomResponse } from './utils.js';
import {
	MessageList,
	SlashCommandMenu,
	MultilineInput,
	InlineMetadata,
	StatusBar,
} from './components/index.js';

export default function App() {
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [tokenCount, setTokenCount] = useState(1247);
	const [showSlashMenu, setShowSlashMenu] = useState(false);
	const [selectedCommandIndex, setSelectedCommandIndex] = useState(0);
	const {exit} = useApp();

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

		return slashCommands.filter((cmd: any) => cmd.command.toLowerCase().includes(searchTerm));
	};

	const filteredCommands = getFilteredCommands();

	const addMessage = useCallback(
		(
			role: 'user' | 'assistant',
			content: string,
			hasToolCalls?: boolean,
			isSlashCommand?: boolean,
			slashCommand?: string,
		) => {
			const message: Message = {
				id: Math.random().toString(36).substring(2, 11),
				role,
				content,
				timestamp: new Date(),
				hasToolCalls,
				isSlashCommand,
				slashCommand,
			};
			setMessages(prev => [...prev, message]);
		},
		[],
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
				setTokenCount(prev => prev + Math.floor(Math.random() * 100) + 50);

				setTimeout(() => {
					const mockResponse = getRandomResponse(userMessage);
					// Simulate tool calls for responses containing certain keywords
					const hasToolCalls =
						mockResponse.includes('```diff') ||
						mockResponse.includes('Modified files') ||
						mockResponse.includes('file diff') ||
						Math.random() > 0.7; // Random 30% chance for demo
					addMessage('assistant', mockResponse, hasToolCalls);
					setIsLoading(false);
					setTokenCount(prev => prev + Math.floor(Math.random() * 150) + 100);
				}, 1000 + Math.random() * 2000);
			}
		},
		[input, isLoading, addMessage],
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
				tokenCount={tokenCount}
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

			{showSlashMenu && filteredCommands.length > 0 && (
				<SlashCommandMenu
					commands={filteredCommands}
					selectedIndex={selectedCommandIndex}
				/>
			)}
		</Box>
	);
}
