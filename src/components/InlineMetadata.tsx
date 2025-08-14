import React from 'react';
import { Text, Box } from 'ink';
import Spinner from 'ink-spinner';
import { Message, TokenUsage } from '../types.js';

interface InlineMetadataProps {
	tokenCount: TokenUsage;
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
			<Box flexDirection="row" alignItems="center">
				<Text color="blue">↓ </Text>
				<Box marginRight={1}>
					<Text color="gray" dimColor>
						{(tokenCount.inputTokens || 0).toLocaleString()}
					</Text>
				</Box>
				<Text color="green">↑ </Text>
				<Box marginRight={1}>
					<Text color="gray" dimColor>
						{(tokenCount.outputTokens || 0).toLocaleString()}
					</Text>
				</Box>
				{tokenCount.reasoningTokens && tokenCount.reasoningTokens > 0 ? (
					<>
						<Text color="purple">⚡ </Text>
						<Box marginRight={1}>
							<Text color="gray" dimColor>
								{(tokenCount.reasoningTokens || 0).toLocaleString()}
							</Text>
						</Box>
					</>
				) : null}
				<Text color="yellow">Σ </Text>
				<Box marginRight={2}>
					<Text color="gray" dimColor>
						{(tokenCount.totalTokens || 0).toLocaleString()}
					</Text>
				</Box>
				<Text color="gray" dimColor>
					• {messages.length || 0} messages • gpt-oss-20b
				</Text>
			</Box>
		</Box>
		<Text color="gray" dimColor>
			{new Date().toLocaleTimeString('en-US', {
				hour: 'numeric',
				minute: '2-digit',
				hour12: true,
			})}
		</Text>
	</Box>
);
