import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can log error info here
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="p-8 text-red-600 font-bold">Something went wrong.</div>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary; 