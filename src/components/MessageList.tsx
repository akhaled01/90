import React from 'react';
import { Text, Box } from 'ink';
import { Message } from '../types.js';

interface MessageListProps {
	messages: Message[];
}

export const MessageList = ({ messages }: MessageListProps) => {
	const renderMessageContent = (content: string) => {
		const lines = content.split('\n');
		return lines.map((line, index) => {
			// Handle diff lines
			if (line.startsWith('```diff')) {
				return (
					<Box key={index} marginY={1}>
						<Text color="gray" backgroundColor="black">
							{line}
						</Text>
					</Box>
				);
			}
			if (line.startsWith('- ')) {
				return (
					<Box key={index}>
						<Text color="red" backgroundColor="black">
							{line}
						</Text>
					</Box>
				);
			}
			if (line.startsWith('+ ')) {
				return (
					<Box key={index}>
						<Text color="green" backgroundColor="black">
							{line}
						</Text>
					</Box>
				);
			}
			if (line.startsWith('@@')) {
				return (
					<Box key={index}>
						<Text color="cyan" backgroundColor="black">
							{line}
						</Text>
					</Box>
				);
			}
			if (line.startsWith('```')) {
				return (
					<Box key={index}>
						<Text color="gray" backgroundColor="black">
							{line}
						</Text>
					</Box>
				);
			}

			// Handle list items
			if (
				line.startsWith('• ') ||
				line.startsWith('- ') ||
				/^\d+\. /.test(line)
			) {
				return (
					<Box key={index} marginLeft={1}>
						<Text color="yellow">{line}</Text>
					</Box>
				);
			}

			// Handle checkboxes
			if (line.includes('☐') || line.includes('☑')) {
				return (
					<Box key={index} marginLeft={1}>
						<Text color="blue">{line}</Text>
					</Box>
				);
			}

			// Handle headers/bold
			if (line.startsWith('**') && line.endsWith('**')) {
				return (
					<Box key={index}>
						<Text bold color="white">
							{line.slice(2, -2)}
						</Text>
					</Box>
				);
			}

			// Regular text
			return (
				<Box key={index}>
					<Text>{line}</Text>
				</Box>
			);
		});
	};

	if (messages.length === 0) {
		return (
			<Box justifyContent="center" alignItems="center" flexGrow={1}>
				<Text color="gray">Start a conversation by typing below...</Text>
			</Box>
		);
	}

	return (
		<Box flexDirection="column">
			{messages.slice(-8).map(message => (
				<Box key={message.id} marginBottom={1} flexDirection="column">
					{message.role === 'user' ? (
						message.isSlashCommand ? (
							<Box borderStyle="round" borderColor="green" padding={1}>
								<Text color="green">/{message.slashCommand}</Text>
								<Box marginTop={0.5}>
									<Text color="gray">{message.content}</Text>
								</Box>
							</Box>
						) : (
							<Box>
								<Text color="gray">$ {message.content}</Text>
							</Box>
						)
					) : (
						<Box flexDirection="row">
							<Box
								marginRight={2}
								borderLeft={true}
								borderRight={false}
								borderTop={false}
								borderBottom={false}
								borderStyle="single"
								borderColor="gray"
								paddingLeft={1}
							>
								<Box flexDirection="column" flexGrow={1}>
									{renderMessageContent(message.content)}
									{message.isStreaming && (
										<Text color="gray"></Text>
									)}
								</Box>
							</Box>
						</Box>
					)}
				</Box>
			))}
		</Box>
	);
};
