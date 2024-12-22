import React from 'react'
import MainProfile from '../../components/customer/MainProfile'
import Sidebar from '../../components/customer/sidebar/Sidebar'
import Navbar from '../../components/customer/navbar/Navbar'

const ProfilePage = () => {
  return (
    <>
      <Navbar />
      <Sidebar />
      <MainProfile />
    </>
  )
}

export default ProfilePage