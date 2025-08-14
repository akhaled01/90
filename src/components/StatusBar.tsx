import React from 'react';
import { Text, Box } from 'ink';

export const StatusBar = () => (
	<Box justifyContent="space-between">
		<Box>
			<Text color="cyan" dimColor>
				✓ Auto-edits: ON • Model: claude-3-sonnet
			</Text>
		</Box>
		<Box>
			<Text color="blue" dimColor>
				📁 Current: app.tsx
			</Text>
		</Box>
	</Box>
);
