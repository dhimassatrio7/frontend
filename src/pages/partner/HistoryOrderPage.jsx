import React from 'react'
import HistoryOrder from '../../components/partner/HistoryOrder'
import Sidebar from '../../components/partner/sidebar/Sidebar'
import Navbar from '../../components/partner/navbar/navbar'

const HistoryOrderPage = () => {
  return (
    <div>
      <Navbar />
      <Sidebar />
      <HistoryOrder />
    </div>
  )
}

export default HistoryOrderPage