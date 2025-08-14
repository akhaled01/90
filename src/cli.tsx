#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
import meow from 'meow';
import App from './app.js';

meow(
	`
	Usage
	  $ 90-cli

	Description
	  A mock AI chat interface for demonstration purposes

	Examples
	  $ 90-cli
	  Start chatting with the mock AI
`,
	{
		importMeta: import.meta,
	},
);

render(<App />);
