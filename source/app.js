import React, { useEffect } from 'react';
import { Box, Text } from 'ink';
import Spinner from 'ink-spinner';
import psi from 'psi';


export default function App({ url, tests = 1 }) {
  const [isFinished, setIsFinished] = React.useState(false);
  const [currentTest, setCurrentTest] = React.useState(0);
  const [testType, setTestType] = React.useState('desktop');
  const [results, setResults] = React.useState([]);

  if (!url) {
    return <Text color="red">No URL Specified, doing nothing</Text>
  }

  const runPsi = async () => {
    const seed = new Date().getTime();

    const tempResults = [];

    for (let i = 0; i < tests; i++) {
      setTestType('Mobile');
      const mobile = await psi(`${url}?_psi=${seed}`, {
        threshold: 1,
        nokey: 'true',
        strategy: 'mobile'
      });

      setTestType('Desktop');
      const desktop = await psi(`${url}?_psi=${seed}`, {
        threshold: 1,
        nokey: 'true',
        strategy: 'desktop'
      });

      tempResults.push({
        mobile: {
          score: mobile.data.lighthouseResult.categories.performance.score * 100,
          si: mobile.data.lighthouseResult.audits['speed-index'].displayValue,
          fcp: mobile.data.lighthouseResult.audits['first-contentful-paint'].displayValue
        },
        desktop: {
          score: desktop.data.lighthouseResult.categories.performance.score * 100,
          si: desktop.data.lighthouseResult.audits['speed-index'].displayValue,
          fcp: desktop.data.lighthouseResult.audits['first-contentful-paint'].displayValue
        }
      });

      setCurrentTest(i + 1);
    }

    setResults(tempResults);
    setIsFinished(true);
  }

  useEffect(() => {
    if (url) {
      runPsi();
    }
  }, [])

  return (
    <>
      <Box borderStyle="classic" display='flex' flexDirection='column' alignItems="center">
        <Text>Page Speed Insight</Text>
        <Box>
          <Text>Testing: </Text><Text color="green">{url}</Text>
        </Box>
      </Box>

      <Box paddingTop={2} paddingBottom={2} display="flex" flexDirection="column" gap={1}>
        {!isFinished ? (
          <Box flexDirection="column">
            {[...Array(tests)].map((_,i) => {
              const isRunningMobile = currentTest === i && testType === 'Mobile';
              const isRunningDesktop = currentTest === i && testType === 'Desktop';
              const isDoneMobile = currentTest > i || currentTest === i && testType === 'Desktop';
              const isDoneDesktop = currentTest > i;
              return (
                <Box flexDirection="column" key={i}>
                  <Text dimColor={!isRunningMobile}>
                    {isRunningMobile ? (
                      <Text color="green">
                        <Spinner type="dots" />
                      </Text>
                    ) : isDoneMobile ? (
                        <Text>✅</Text>
                    ): <Text>•</Text>
                    }
                    <Text strikethrough={isDoneMobile}>{` Test #${i + 1} - Mobile`}</Text>
                  </Text>
                  <Text dimColor={!isRunningDesktop}>
                    {isRunningDesktop ? (
                      <Text color="green">
                        <Spinner type="dots" />
                      </Text>
                    ) : isDoneDesktop ? (
                        <Text>✅</Text>
                    ): <Text>•</Text>
                    }
                    <Text strikethrough={isDoneDesktop}>{` Test #${i + 1} - Desktop`}</Text>
                  </Text>
                </Box>
              )})}
          </Box>
        ) : (
          <>
            <Box borderStyle="round" padding={1} flexDirection="column" gap={1}>
              <Text bold color="green">Mobile</Text>
              {results.map((result, i) => (
                <Box key={i} flexDirection="column">
                  <Text color="green">Test #{i + 1}</Text>
                  <Box justifyContent="space-between">
                    <Box width="33.33%"><Text>Score: <Text color="blue">{result.mobile.score}</Text></Text></Box>
                    <Box width="33.33%"><Text>Speed Index: <Text color="blue">{result.mobile.si}</Text></Text></Box>
                    <Box width="33.33%"><Text>First Contentful Paint: <Text color="blue">{result.mobile.fcp}</Text></Text></Box>
                  </Box>
                </Box>
              ))}
            </Box>

            <Box borderStyle="round" padding={1} flexDirection="column" gap={1}>
              <Text bold color="green">Desktop</Text>
              {results.map((result, i) => (
                <Box key={i} flexDirection="column">
                  <Text color="green">Test #{i + 1}</Text>
                  <Box justifyContent="space-between">
                    <Box width="33.33%"><Text>Score: <Text color="blue">{result.desktop.score}</Text></Text></Box>
                    <Box width="33.33%"><Text>Speed Index: <Text color="blue">{result.desktop.si}</Text></Text></Box>
                    <Box width="33.33%"><Text>First Contentful Paint: <Text color="blue">{result.desktop.fcp}</Text></Text></Box>
                  </Box>
                </Box>
              ))}
            </Box>

            <Box justifyContent="center">
              <Text bold color="green">🎉 All tests finished! 🎉</Text>
            </Box>
          </>
        )}
      </Box>
    </>
  );
}
