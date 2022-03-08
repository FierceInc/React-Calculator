/* eslint-disable no-eval */
/* eslint-disable no-unused-vars */
import react from "react";
import ReactDOM from "react-dom";
import "./index.css";

const endsWithOperator = /[x+/%-]$/;
const endsWithDot = /[.]$/
const styles = {
  noError: {
    color: "lime",
  },
  maxDigits: {
    color: "yellow",
  },
  syntaxError: {
    color: "red",
  },
};

class App extends react.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentVal: "0",
      previousValue: "0",
      formula: "0",
      evaluated: false,
      currentSign: "",
      color: styles.noError,
    };

    this.handleDecimal = this.handleDecimal.bind(this);
    this.maxDigitsPassed = this.maxDigitsPassed.bind(this);
    this.handleSyntax = this.handleSyntax.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.handleOperators = this.handleOperators.bind(this);
    this.handlePercentage = this.handlePercentage.bind(this);
    this.handleNumbers = this.handleNumbers.bind(this);
    this.handleCalculate = this.handleCalculate.bind(this);
  }

  handleSyntax() {
    this.setState({
      currentVal: "Sytax Error",
      color: styles.syntaxError,
    });
    setTimeout(
      () =>
        this.setState({ currentVal: "0", formula: "", color: styles.noError }),
      2000
    );
  }

  maxDigitsPassed() {
    this.setState({
      currentVal: "Digit Limit Met",
      color: styles.maxDigits,
    });
    setTimeout(
      () =>
        this.setState({ currentVal: "0", formula: "", color: styles.noError }),
      2000
    );
  }

  handleCalculate() {
    try {
      if (!this.state.currentVal.includes("Limit")) {
        let expression = this.state.formula;
        const { formula } = this.state;
        while (endsWithOperator.test(expression)) {
          expression = expression.slice(0, -1);
        }
        expression = expression
          .replace(/x/g, "*")
          .replace(/‑/g, "-")
          .replace("--", "+0+0+0+0+0+0+")
          .replace("%", "/100*");
        let answer =
          Math.round(1000000000000 * eval(expression)) / 1000000000000;
        this.setState({
          currentVal:
            answer.toString() === "Infinity"
              ? this.syntaxError()
              : answer.toString(),
          formula: endsWithOperator.test(formula) ? expression : formula,
          previousValue: answer,
          evaluated: true,
        });
      }
    } catch (error) {
      this.handleSyntax();
    }
  }

  handleOperators(e) {
    try {
      if (!this.state.currentVal.includes("Limit")) {
        const value = e.target.value;
        const { formula, previousValue, evaluated,   currentSign} = this.state;
        this.setState({ evaluated: false });
        if (evaluated) {
          this.setState({ formula: previousValue + value });
        } else if (endsWithOperator.test(formula)) {
          if (value === "-") {
            this.setState({
              formula: formula.slice(0, -1).includes("-") ? formula : formula + value,
                 currentSign: value,
              currentVal: formula.slice(0, -1).includes("-") ? formula : formula + value,
            });
          } else {
            this.setState({
              formula: endsWithOperator.test(formula.slice(0, -1))
                ? formula.slice(0, -2) + value
                : formula.slice(0, -1) + value,
                 currentSign: value,
              currentVal: endsWithOperator.test(formula.slice(0, -1))
                ? formula.slice(0, -2) + value
                : formula.slice(0, -1) + value,
            });
          }
        } else {
          this.setState({
            formula: formula + value,
               currentSign: value,
            currentVal: formula
          });
        }
      }
    } catch (error) {
      this.handleSyntax();
    }
  }

  handleNumbers(event) {
    const value = event.target.value;
    const { formula, evaluated } = this.state;
    this.setState({
      evaluated: false,
    });

    if (formula.length > 18) {
      this.maxDigitsPassed();
    } else {
      if (evaluated) {
        this.setState({
          formula: value,
          previousValue: "0",
          currentVal: "0",
        });
      } else {
        this.setState({
          formula: formula === "0" ? formula.replace("0", "") + value : formula + value,
          currentVal: formula === "0" ? formula.replace("0", "") + value : formula + value,
        });
      }
    }
  }

  handleDecimal(e) {
    const value = e.target.value;
    const { formula, evaluated, currentSign, currentVal} = this.state;
    this.setState({ evaluated: false });
    if(evaluated) {
      this.setState({
        formula: "0.",
        previousValue: "0",
        currentVal: "0"
      });
    }
     else {
        this.setState({
         formula: endsWithDot.test(formula) ? formula : currentSign === "." ? formula : formula + value,
        previousValue: "0",
        currentVal: endsWithDot.test(formula) ? formula : currentSign === "." ? formula : formula + value,
          currentSign: value
      });
     }
  }
  handlePercentage(event) {
    const value = event.target.value;
    const { formula, currentVal, evaluated, previousValue } = this.state;
    if (!currentVal.includes("Limit")) {
      this.setState({ evaluated: false });
      if (evaluated) {
        this.setState({ formula: previousValue + value });
      } else {
        this.setState({
          formula: endsWithOperator.test(formula.slice(0, -1))
            ? formula.slice(0, -1)
            : formula + value,
        });
      }
    }
  }

  handleClear(event) {
    const value = event.target.value;
    const { formula } = this.state;
    this.setState({
      formula: value === "CL" ? formula.slice(0, -1) : value === "AC" ? "0" : "0",
      currentVal: "0",
      previousValue: "0",
      evaluated: false,
       currentSign: ""
    });
  }

  render() {
    return (
     <div className="calculator">
        <h1>React Calculator</h1>
        <FormulaScreen formula={this.state.formula} />
        <OutputScreen
          currentValue={this.state.currentVal}
          color={this.state.color}
        />
        <Buttons
          delete={this.handleClear}
          numbers={this.handleNumbers}
          operators={this.handleOperators}
          calculate={this.handleCalculate}
          percentage={this.handlePercentage}
          decimal={this.handleDecimal}
        />
      </div>
    );
  }
}
function FormulaScreen(props) {
  return (
    <div>
      <div className="formulaScreen" > {props.formula.replace(/x/g, "*")}</div>
    </div>
  );
}
function OutputScreen(props) {
  return (
    <>
      <div className="outputScreen" style={props.color}>
        {" "}
        {props.currentValue}{" "}
      </div>
    </>
  );
}

function Buttons(props) {
  return (
    <div className="allButtons">
      <div className="firstRow">
        <button
          className="clearScreen"
          id="clearAll"
          onClick={props.delete}
          value="CL"
        >
          CL
        </button>
        <button
          className="clearScreen"
          id="clear"
          onClick={props.delete}
          value="AC"
        >
          AC
        </button>
      </div>

      <div className="buttons">
        <button id="one" onClick={props.numbers} value="1">
          1
        </button>
        <button id="two" onClick={props.numbers} value="2">
          2
        </button>
        <button id="three" onClick={props.numbers} value="3">
          3
        </button>
        <button id="subtract" onClick={props.operators} value="-">
          -
        </button>

        <button id="four" onClick={props.numbers} value="4">
          4
        </button>
        <button id="five" onClick={props.numbers} value="5">
          5
        </button>
        <button id="six" onClick={props.numbers} value="6">
          6
        </button>
        <button id="divide" onClick={props.operators} value="/">
          /
        </button>

        <button id="seven" onClick={props.numbers} value="7">
          7
        </button>
        <button id="eight" onClick={props.numbers} value="8">
          8
        </button>
        <button id="nine" onClick={props.numbers} value="9">
          9
        </button>
        <button id="multiply" onClick={props.operators} value="x">
          x
        </button>
      </div>

      <div className="lastRow">
        <button id="modulas" onClick={props.percentage} value="%">
          %
        </button>
        <button id="decimal" onClick={props.decimal} value=".">
          .
        </button>

        <button id="zero" onClick={props.numbers} value="0">
          0
        </button>
        <button id="add" onClick={props.operators} value="+">
          +
        </button>
      </div>
      <button id="calculate" onClick={props.calculate} value="=">
        =
      </button>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
