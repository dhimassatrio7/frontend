import React from 'react'
import bantuinLogo from '../../../assets/images/bantuin-logo.png'

const navbar = () => {
  return (
    <div className='flex justify-between items-center px-12 sm:hidden p-4'>
      <a href='/'>
        <img className='h-12' src={bantuinLogo} alt="logo" />
      </a>

      <div>
        {window.location.pathname == '/customer-profile' ? (
          <a href="/customer/history" className='font-semibold p-2 border rounded-md bg-blue-300'>
            Riwayat Pesanan
          </a>
        ) : (
          <a href="/customer-profile" className='font-semibold p-2 border rounded-md bg-blue-300'>
            Daftar Pesanan
          </a>
        )}
        
      </div>
    </div>
  )
}

export default navbar