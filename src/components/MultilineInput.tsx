import React from 'react';
import { useInput } from 'ink';
import TextInput from 'ink-text-input';
import { SlashCommand } from '../types.js';

interface MultilineInputProps {
	value: string;
	onChange: (value: string) => void;
	onSubmit: (slashCommand?: string) => void;
	isLoading: boolean;
	showSlashMenu: boolean;
	setShowSlashMenu: (show: boolean) => void;
	selectedCommandIndex: number;
	setSelectedCommandIndex: (index: number) => void;
	filteredCommands: SlashCommand[];
}

export const MultilineInput = ({
	value,
	onChange,
	onSubmit,
	isLoading,
	showSlashMenu,
	setShowSlashMenu,
	selectedCommandIndex,
	setSelectedCommandIndex,
	filteredCommands,
}: MultilineInputProps) => {
	// Check if input should trigger slash menu (starts with / and only contains whitespace after)
	const shouldShowSlashMenu = (input: string) => {
		if (!input.startsWith('/')) return false;
		const afterSlash = input.slice(1);
		return (
			afterSlash.trim() === '' ||
			afterSlash === afterSlash.replace(/[^\s]/g, '')
		);
	};

	// Reset selected index when commands change
	const resetSelectedIndex = () => {
		setSelectedCommandIndex(0);
	};

	useInput((_: string, key: any) => {
		if (isLoading) return;

		// Handle slash menu navigation
		if (showSlashMenu && shouldShowSlashMenu(value)) {
			if (key.upArrow) {
				setSelectedCommandIndex(
					selectedCommandIndex > 0
						? selectedCommandIndex - 1
						: filteredCommands.length - 1,
				);
				return;
			} else if (key.downArrow) {
				setSelectedCommandIndex(
					selectedCommandIndex < filteredCommands.length - 1
						? selectedCommandIndex + 1
						: 0,
				);
				return;
			} else if (key.return) {
				const selectedCommand = filteredCommands[selectedCommandIndex];
				if (selectedCommand) {
					// Clear input and hide menu
					onChange('');
					setShowSlashMenu(false);
					setSelectedCommandIndex(0);
					// Trigger slash command submission
					onSubmit(selectedCommand.command);
				}
				return;
			} else if (key.escape) {
				setShowSlashMenu(false);
				setSelectedCommandIndex(0);
				onChange('');
				return;
			}
			// Allow regular typing to filter commands when menu is open
			// Don't return here so the input can be updated normally
		}
	});

	return (
		<TextInput
			value={value}
			onChange={(newValue: string) => {
				onChange(newValue);

				// Show slash menu when input should trigger it
				if (shouldShowSlashMenu(newValue) && !showSlashMenu) {
					setShowSlashMenu(true);
					setSelectedCommandIndex(0);
				} else if (!shouldShowSlashMenu(newValue) && showSlashMenu) {
					setShowSlashMenu(false);
					setSelectedCommandIndex(0);
				}

				// Reset selected index when typing to filter commands
				if (showSlashMenu && shouldShowSlashMenu(newValue)) {
					resetSelectedIndex();
				}
			}}
			onSubmit={() => {
				if (showSlashMenu) {
					// If menu is open, select current command
					const selectedCommand = filteredCommands[selectedCommandIndex];
					if (selectedCommand) {
						// Clear input and hide menu
						onChange('');
						setShowSlashMenu(false);
						setSelectedCommandIndex(0);
						// Trigger slash command submission
						onSubmit(selectedCommand.command);
					}
				} else if (value.trim() && !isLoading) {
					onSubmit();
				}
			}}
			placeholder="Type your message (/ for commands, Enter to send, Ctrl+C to exit)..."
		/>
	);
};
