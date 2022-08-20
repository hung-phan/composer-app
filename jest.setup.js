require("jsdom-global/register");

const React = require("react");

// disable ssr issue
React.useLayoutEffect = React.useEffect;
