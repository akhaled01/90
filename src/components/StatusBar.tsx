import React from 'react';
import { Text, Box } from 'ink';

export const StatusBar = () => (
	<Box justifyContent="space-between">
		<Box>
			<Text color="cyan" dimColor>
				Model: gpt-oss-20b
			</Text>
		</Box>
	</Box>
);
