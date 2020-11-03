const { default: Couter } = require("./components/counter/counter.com");
const {
  default: CalculatorPage,
} = require("./pages/calculator/calculator.com");
const { default: UserinputPage } = require("./pages/userinput/user-input.com");

function App() {
  return (
    <div className="App">
      <CalculatorPage />
    </div>
  );
}

export default App;
