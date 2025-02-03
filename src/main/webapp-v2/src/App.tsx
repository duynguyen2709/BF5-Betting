import { useCounterStore } from './stores';
import { Button } from 'antd';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const { count, increment, decrement, reset } = useCounterStore();

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React + Zustand</h1>
      <div className="card">
        <Button type="primary" onClick={increment}>
          count is {count}
        </Button>
        <div style={{ marginTop: '1rem' }}>
          <Button onClick={decrement} style={{ marginRight: '0.5rem' }}>
            Decrement
          </Button>
          <Button onClick={reset}>
            Reset
          </Button>
        </div>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
