import React from 'react'
import Historyorder from '../../components/customer/HistoryOrder'
import Sidebar from '../../components/customer/sidebar/Sidebar'
import Navbar from '../../components/customer/navbar/Navbar'

const HistoryOrderPage = () => {
  return (
    <div>
      <Navbar />
      <Sidebar />
      <Historyorder />
    </div>
  )
}

export default HistoryOrderPage