const React = require('react');
const deepForceUpdate = require('react-deep-force-update');
const Redbox = require('redbox-react');
const { Component } = React;

// Feature check for the createElement() patch.
// If createElement() was patched, types with
// the same __source will resolve to the same type.
let wasCreateElementPatched = false;
const A = () => {};
A.__source = { fileName: 'fake', localName: 'fake' }
const B = () => {};
B.__source = { fileName: 'fake', localName: 'fake' }
if (<A />.type === <B />.type) {
  wasCreateElementPatched = true;
}

class AppContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  componentDidMount() {
    if (!wasCreateElementPatched) {
      console.error(
        'React Hot Loader: It appears that "react-hot-loader/patch" ' +
        'did not run immediately before the app started. Make sure that it ' +
        'runs before any other code. For example, if you use Webpack, ' +
        'you can add "react-hot-loader/patch" as the very first item to the ' +
        '"entry" array in its config. Alternatively, you can add ' +
        'require("react-hot-loader/patch") as the very first line ' +
        'in the application code, before any other imports.'
      );
    }
  }

  componentWillReceiveProps(nextProps) {
    // Hot reload is happening.
    // Retry rendering!
    if (nextProps.component !== this.props.component) {
      this.setState({
        error: null
      });
    }
  }

  componentDidUpdate(prevProps) {
    // Hot reload has finished.
    // Force-update the whole tree, including
    // components that refuse to update.
    if (prevProps.component !== this.props.component) {
      deepForceUpdate(this);
    }
  }

  // This hook is going to become official in React 15.x.
  // In 15.0, it only catches errors on initial mount.
  // Later it will work for updates as well:
  // https://github.com/facebook/react/pull/6020
  unstable_handleError(error) {
    this.setState({
      error: error
    });
  }

  render() {
    const { error } = this.state;
    if (error) {
      return <this.props.errorReporter error={error} />;
    } else {
      return <this.props.component {...this.props.props} />;
    }
  }
}

AppContainer.defaultProps = {
  errorReporter: Redbox
};

module.exports = AppContainer;