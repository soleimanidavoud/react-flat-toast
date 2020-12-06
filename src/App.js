import { useToasts } from "./Providers/ToastProvider";

function App() {
  const { addToast } = useToasts();

  const showMessage = (_) => addToast("hey im a message");

  return (
    <div className="App">
      <button onClick={showMessage}>add toast</button>
    </div>
  );
}

export default App;
