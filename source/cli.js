#!/usr/bin/env node
import React from 'react';
import { render } from 'ink';
import meow from 'meow';
import App from './app.js';

const cli = meow(
  `
	Usage
	  $ auto-psi --url=<url>

	Options
		--url URL to test
    --tests Number of tests to run, defaults to 3

	Examples
	  $ auto-psi --url=https://example.com
`,
  {
    importMeta: import.meta,
    flags: {
      url: {
        type: 'string',
      },
      tests: {
        type: 'number',
      }
    },
  },
);

render(<App url={cli.flags.url} tests={cli.flags.tests} />);
