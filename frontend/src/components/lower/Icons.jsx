export const CircleIcon = ({currentNest, nestId}) => (
  <svg
    className={`nest ${currentNest.id === nestId ? 'active' : ''}`}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
  </svg>
);

export const PowerIcon = () => (
  <svg
    className="ws-connection-icon"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
    <line x1="12" y1="2" x2="12" y2="12" />
  </svg>
);

export const WSIcon = ({wsToggleOn, toggleWSConnectionPanel, displayFlashMessage, hideFlashMessage}) => {

  return (
    <svg
    onClick={toggleWSConnectionPanel}
    onMouseEnter={() => displayFlashMessage('WS Connection Panel', 'hover')}
    onMouseLeave={hideFlashMessage}
    className={`ws-panel-icon ${wsToggleOn ? 'active' : ''}`}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
)};

export const ClockIcon = ({nestHistoryToggle, displayFlashMessage, hideFlashMessage}) => (
  <svg
    onMouseEnter={() => displayFlashMessage('Last Visited Nests', 'hover')}
    onMouseLeave={hideFlashMessage}
    className={`nest-history-icon ${nestHistoryToggle ? 'active' : ''}`}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="black"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export const PlusCircleIcon = ({displayFlashMessage, hideFlashMessage}) => (
  <svg
    onMouseEnter={() => displayFlashMessage('Generate New Nest', 'hover')}
    onMouseLeave={hideFlashMessage}
    className="new-nest-icon"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="black"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

export const SendIcon = ({displayFlashMessage, hideFlashMessage}) => (
  <svg
    className="send-test-request-icon"
    onMouseEnter={() => displayFlashMessage('Send Test Request', 'hover')}
    onMouseLeave={hideFlashMessage}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="black"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
    <line x1="16" y1="8" x2="2" y2="22" />
    <line x1="17.5" y1="15" x2="9" y2="15" />
  </svg>
);

export const CopyIcon = ({displayFlashMessage, hideFlashMessage}) => (
  <svg
    className="copy-nest-url-icon"
    onMouseEnter={() => displayFlashMessage('Copy Nest URL', 'hover')}
    onMouseLeave={hideFlashMessage}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="black"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);