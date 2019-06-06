import React from 'react';

class ServerError extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      errorInfo: null
    };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.error) {
      // Fallback UI if an error occurs
      return (
        <>
          <div className="flex">
            <h1>{this.state.error && this.state.error.toString()}</h1>
          </div>
          <section className="flex col5">
            <div>
                
                <p className="red">{this.state.errorInfo.componentStack}</p>
                
            </div>
          </section>
        </>
      );
    }
    // component normally just renders children
    return this.props.children;
  }
}

export default ServerError;
