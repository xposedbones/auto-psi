import React, { useEffect } from 'react';
import { Box, Text } from 'ink';
import Spinner from 'ink-spinner';
import psi from 'psi';
export default function App({
  url,
  tests = 1
}) {
  const [isFinished, setIsFinished] = React.useState(false);
  const [currentTest, setCurrentTest] = React.useState(0);
  const [testType, setTestType] = React.useState('desktop');
  const [results, setResults] = React.useState([]);
  if (!url) {
    return /*#__PURE__*/React.createElement(Text, {
      color: "red"
    }, "No URL Specified, doing nothing");
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
  };
  useEffect(() => {
    if (url) {
      runPsi();
    }
  }, []);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Box, {
    borderStyle: "classic",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  }, /*#__PURE__*/React.createElement(Text, null, "Page Speed Insight"), /*#__PURE__*/React.createElement(Box, null, /*#__PURE__*/React.createElement(Text, null, "Testing: "), /*#__PURE__*/React.createElement(Text, {
    color: "green"
  }, url))), /*#__PURE__*/React.createElement(Box, {
    paddingTop: 2,
    paddingBottom: 2,
    display: "flex",
    flexDirection: "column",
    gap: 1
  }, !isFinished ? /*#__PURE__*/React.createElement(Box, {
    flexDirection: "column"
  }, [...Array(tests)].map((_, i) => {
    const isRunningMobile = currentTest === i && testType === 'Mobile';
    const isRunningDesktop = currentTest === i && testType === 'Desktop';
    const isDoneMobile = currentTest > i || currentTest === i && testType === 'Desktop';
    const isDoneDesktop = currentTest > i;
    return /*#__PURE__*/React.createElement(Box, {
      flexDirection: "column",
      key: i
    }, /*#__PURE__*/React.createElement(Text, {
      dimColor: !isRunningMobile
    }, isRunningMobile ? /*#__PURE__*/React.createElement(Text, {
      color: "green"
    }, /*#__PURE__*/React.createElement(Spinner, {
      type: "dots"
    })) : isDoneMobile ? /*#__PURE__*/React.createElement(Text, null, "\u2705") : /*#__PURE__*/React.createElement(Text, null, "\u2022"), /*#__PURE__*/React.createElement(Text, {
      strikethrough: isDoneMobile
    }, ` Test #${i + 1} - Mobile`)), /*#__PURE__*/React.createElement(Text, {
      dimColor: !isRunningDesktop
    }, isRunningDesktop ? /*#__PURE__*/React.createElement(Text, {
      color: "green"
    }, /*#__PURE__*/React.createElement(Spinner, {
      type: "dots"
    })) : isDoneDesktop ? /*#__PURE__*/React.createElement(Text, null, "\u2705") : /*#__PURE__*/React.createElement(Text, null, "\u2022"), /*#__PURE__*/React.createElement(Text, {
      strikethrough: isDoneDesktop
    }, ` Test #${i + 1} - Desktop`)));
  })) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Box, {
    borderStyle: "round",
    padding: 1,
    flexDirection: "column",
    gap: 1
  }, /*#__PURE__*/React.createElement(Text, {
    bold: true,
    color: "green"
  }, "Mobile"), results.map((result, i) => /*#__PURE__*/React.createElement(Box, {
    key: i,
    flexDirection: "column"
  }, /*#__PURE__*/React.createElement(Text, {
    color: "green"
  }, "Test #", i + 1), /*#__PURE__*/React.createElement(Box, {
    justifyContent: "space-between"
  }, /*#__PURE__*/React.createElement(Box, {
    width: "33.33%"
  }, /*#__PURE__*/React.createElement(Text, null, "Score: ", /*#__PURE__*/React.createElement(Text, {
    color: "blue"
  }, result.mobile.score))), /*#__PURE__*/React.createElement(Box, {
    width: "33.33%"
  }, /*#__PURE__*/React.createElement(Text, null, "Speed Index: ", /*#__PURE__*/React.createElement(Text, {
    color: "blue"
  }, result.mobile.si))), /*#__PURE__*/React.createElement(Box, {
    width: "33.33%"
  }, /*#__PURE__*/React.createElement(Text, null, "First Contentful Paint: ", /*#__PURE__*/React.createElement(Text, {
    color: "blue"
  }, result.mobile.fcp))))))), /*#__PURE__*/React.createElement(Box, {
    borderStyle: "round",
    padding: 1,
    flexDirection: "column",
    gap: 1
  }, /*#__PURE__*/React.createElement(Text, {
    bold: true,
    color: "green"
  }, "Desktop"), results.map((result, i) => /*#__PURE__*/React.createElement(Box, {
    key: i,
    flexDirection: "column"
  }, /*#__PURE__*/React.createElement(Text, {
    color: "green"
  }, "Test #", i + 1), /*#__PURE__*/React.createElement(Box, {
    justifyContent: "space-between"
  }, /*#__PURE__*/React.createElement(Box, {
    width: "33.33%"
  }, /*#__PURE__*/React.createElement(Text, null, "Score: ", /*#__PURE__*/React.createElement(Text, {
    color: "blue"
  }, result.desktop.score))), /*#__PURE__*/React.createElement(Box, {
    width: "33.33%"
  }, /*#__PURE__*/React.createElement(Text, null, "Speed Index: ", /*#__PURE__*/React.createElement(Text, {
    color: "blue"
  }, result.desktop.si))), /*#__PURE__*/React.createElement(Box, {
    width: "33.33%"
  }, /*#__PURE__*/React.createElement(Text, null, "First Contentful Paint: ", /*#__PURE__*/React.createElement(Text, {
    color: "blue"
  }, result.desktop.fcp))))))), /*#__PURE__*/React.createElement(Box, {
    justifyContent: "center"
  }, /*#__PURE__*/React.createElement(Text, {
    bold: true,
    color: "green"
  }, "\uD83C\uDF89 All tests finished! \uD83C\uDF89")))));
}