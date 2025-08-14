import React from 'react';
import {Text, Box} from 'ink';
import {Message} from '../types.js';
import {marked} from 'marked';
import {markedTerminal} from 'marked-terminal';
interface MessageListProps {
	messages: Message[];
}

marked.use(markedTerminal() as any);

export const MessageList = ({messages}: MessageListProps) => {
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
									<Text>{marked.parse(message.content) as string}</Text>
									{message.isStreaming && <Text color="gray">▋</Text>}
								</Box>
							</Box>
						</Box>
					)}
				</Box>
			))}
		</Box>
	);
};
