import React from 'react';
import { Text, Box } from 'ink';
import { SlashCommand } from '../types.js';

interface SlashCommandMenuProps {
	commands: SlashCommand[];
	selectedIndex: number;
}

export const SlashCommandMenu = ({
	commands,
	selectedIndex,
}: SlashCommandMenuProps) => {
	return (
		<Box
			flexDirection="column"
			borderStyle="round"
			borderColor="green"
			padding={1}
			marginTop={1}
		>
			<Box marginBottom={1}>
				<Text color="green" bold>
					Slash Commands
				</Text>
			</Box>
			{commands.map((cmd, index) => {
				const isSelected = index === selectedIndex;
				return (
					<Box
						key={cmd.command}
						flexDirection="row"
						alignItems="center"
						marginBottom={index < commands.length - 1 ? 0.5 : 0}
					>
						<Text color={isSelected ? 'green' : 'gray'}>
							{isSelected ? '> ' : '  '}/{cmd.command}
						</Text>
						<Box marginLeft={2}>
							<Text color={isSelected ? 'white' : 'gray'}>
								{cmd.description}
							</Text>
						</Box>
						<Box marginLeft={2}>
							<Text
								color={isSelected ? 'yellow' : 'gray'}
								dimColor={!isSelected}
							>
								({cmd.example})
							</Text>
						</Box>
					</Box>
				);
			})}
			<Box marginTop={1}>
				<Text color="gray" dimColor>
					Use ↑/↓ to navigate, Enter to select, Esc to cancel
				</Text>
			</Box>
		</Box>
	);
};
