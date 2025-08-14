import { mockResponses } from './constants.js';

export const getRandomResponse = (userMessage: string): string => {
	const responses = [...mockResponses];

	// Add contextual responses based on user message
	if (userMessage.toLowerCase().includes('help')) {
		responses.push(
			"I'm here to help! What would you like assistance with?",
			'Happy to help! Could you provide more details?',
			'Let me assist you with that. What specifically do you need?',
		);
	}

	if (userMessage.toLowerCase().includes('error')) {
		responses.push(
			"Let's debug this error together. Can you share the error message?",
			'Error handling is important. Here are some common solutions:',
			'I see you have an error. Let me help you troubleshoot it.',
		);
	}

	if (userMessage.includes('?')) {
		responses.push(
			"That's a great question! Let me think...",
			"Good question! Here's what I think:",
			'Interesting question! My take is:',
		);
	}

	const randomIndex = Math.floor(Math.random() * responses.length);
	return responses[randomIndex]!;
};
