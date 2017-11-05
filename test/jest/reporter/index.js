import { h, render } from 'preact';
import TestResultSuiteComponent from './component.jsx';
import { ResultLeaf, ResultTree } from './tree';

class Reporter {
  constructor(globalConfig, options) {
    this._globalConfig = globalConfig;
    this._options = options;
    global.resultTree = this.resultTree = new ResultTree('Test Results');
  }

  onRunStart() {
    const element = document.createElement('div');
    element.id = 'jest';
    render(<TestResultSuiteComponent node={this.resultTree}/>, element);

    const styleElement = document.createElement('style');
    styleElement.type = 'text/css';
    styleElement.textContent = `
    #jest {
      font: 20px/1.5 "Helvetica Neue",Helvetica,Arial,sans-serif;
      font-size: .8em;
    }

    #jest ul {
      list-style: none;
      margin: 1px 0;
    }

    #jest h2 {
      font-weight: normal;
      margin: 3px 0;
    }

    #jest h3 {
      font-weight: normal;
      margin: 1px 0;
    }

    #jest h3:before {
      content: '✓';
      color: green;
      margin-right: 5px;
    }

    #jest .test.failed .description::before {
      content: '✗';
      color: red;
      margin-right: 5px;
    }
    `;

    document.head.appendChild(styleElement);
    document.body.appendChild(element);
  }

  onTestResult(test, result, results) {
    global.result = result;
    for (const testResult of result.testResults) {
      this.addTestResult(testResult);
    }
  }

  onRumComplete(result) {
  }

  addTestResult(testResult) {
    let tree = this.resultTree;
    for (const title of testResult.ancestorTitles) {
      let childTree = tree.get(title)
      if (!childTree) {
        childTree = new ResultTree(title);
        tree.add(childTree);
      }
      tree = childTree;
    }
    tree.add(new ResultLeaf(testResult.title || testResult.displayName, testResult));
  }
}

module.exports = Reporter;
