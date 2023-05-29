import React from "react";
import PropTypes from "prop-types";
import Error520 from "client/Error520";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  // eslint-disable-next-line no-unused-vars
  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error(error, errorInfo);
    this.setState({ error: error });
    this.props.onError && this.props.onError();
  }

  render() {
    if (this.state.hasError && this.state.error) {
      // You can render any custom fallback UI
      return <Error520 errorLog={this.state.error} />;
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.any,
  onError: PropTypes.func,
};

export default ErrorBoundary;
