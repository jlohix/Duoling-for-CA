import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { message: "" };
  }

  static getDerivedStateFromError(error) {
    return { message: error?.message || String(error) };
  }

  render() {
    if (this.state.message) {
      return (
        <div className="page">
          <h1>Something broke</h1>
          <p>{this.state.message}</p>
          <button
            type="button"
            className="primary"
            onClick={() => window.location.reload()}
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
