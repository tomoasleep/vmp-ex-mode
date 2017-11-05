import { h, Component } from 'preact';

class TestResultComponent extends Component {
  render({ node }) {
    return (
      <div className={`test ${ node.isFailed ? 'failed' : 'success' }`}>
        <h3 className='description'>{ node.getDescription() }</h3>
        {
          node.isFailed() &&
            (
              <pre>{ node.getFailureMessage() }</pre>
            )
        }
      </div>
    );
  }

  componentDidMount() {
    const { node } = this.props;
    if (this.subscription) {
      this.subscription.dispose();
    }
    this.subscription = node.onDidUpdate(() => this.forceUpdate());
  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.dispose();
    }
  }
}

export default class TestResultSuiteComponent extends Component {
  render ({ node }) {
    return (
      <div className="test-results">
        <h2 className='description'>{ node.getDescription() }</h2>
        <ul>
          {
            Array.from(node.getIter(), (childNode) => {
              return (<li> { this.renderChildNode(childNode) } </li>);
            })
          }
        </ul>
      </div>
    );
  }

  renderChildNode (childNode) {
    if (childNode.isSuite()) {
      return <TestResultSuiteComponent node={childNode} key={childNode.getDescription()} />
    } else {
      return <TestResultComponent node={childNode} key={childNode.getDescription()} />
    }
  }

  componentDidMount() {
    const { node } = this.props;
    if (this.subscription) {
      this.subscription.dispose();
    }
    this.subscription = node.onDidUpdate(() => this.forceUpdate());
  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.dispose();
    }
  }
}
