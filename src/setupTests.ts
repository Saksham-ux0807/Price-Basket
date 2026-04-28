import '@testing-library/jest-dom'

// jsdom does not implement scrollIntoView; provide a no-op stub so components
// that call it (e.g. AutocompleteDropdown's keyboard-focus scroll) don't throw.
window.HTMLElement.prototype.scrollIntoView = function () {};
