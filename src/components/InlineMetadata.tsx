import React from 'react';
import { Text, Box } from 'ink';
import Spinner from 'ink-spinner';
import { Message } from '../types.js';

interface InlineMetadataProps {
	tokenCount: number;
	messages: Message[];
	isLoading: boolean;
}

export const InlineMetadata = ({
	tokenCount,
	messages,
	isLoading,
}: InlineMetadataProps) => (
	<Box justifyContent="space-between" marginBottom={0.5} width="100%">
		<Box flexDirection="row" alignItems="center">
			{isLoading && (
				<Box marginRight={3} flexDirection="row" alignItems="center">
					<Spinner type="dots" />
					<Text color="yellow"> Thinking</Text>
				</Box>
			)}
			<Text color="gray" dimColor>
				{tokenCount.toLocaleString()} tokens • {messages.length} messages •
				claude-3-sonnet
			</Text>
		</Box>
		<Text color="gray" dimColor>
			{new Date().toLocaleTimeString()}
		</Text>
	</Box>
);
