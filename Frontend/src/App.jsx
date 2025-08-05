import React from 'react'
import Login from './Pages/Login'
import Register from './Pages/Register'

import {Route, Routes} from 'react-router-dom'

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  )
}

export default App