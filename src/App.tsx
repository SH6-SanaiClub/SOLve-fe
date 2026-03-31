// import { useEffect, useState } from 'react'
import BottomNavigation from './components/layout/BottomNavigation2'
import MainLayout from './components/layout/MainLayout'

// interface Item {
//   id: number
//   name: string
//   description: string
// }

function App() {
  // const [items, setItems] = useState<Item[]>([])

  // useEffect(() => {
  //   fetch('/api/test')
  //     .then(res => res.json())
  //     .then(data => setItems(data))
  //     .catch(err => console.error(err))
  // }, [])

  return (
    <MainLayout>

      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">ESG Platform - 연결 테스트</h1>
        <p className="mb-2">API 응답 데이터:</p>
        <ul>
          {/* {items.map((item) => (
          <li key={item.id}>{item.name} - {item.description}</li>
          ))} */}
        </ul>
        <BottomNavigation />
      </div>
    </MainLayout>
  )
}

export default App