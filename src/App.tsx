import { useEffect, useState } from 'react'

function App() {
  const [items, setItems] = useState([])

  useEffect(() => {
    fetch('/api/test')
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(err => console.error(err))
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">ESG Platform - 연결 테스트</h1>
      <p className="mb-2">API 응답 데이터:</p>
      <ul>
        {items.map((item: any) => (
          <li key={item.id}>{item.name} - {item.description}</li>
        ))}
      </ul>
    </div>
  )
}

export default App