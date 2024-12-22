import React from 'react'
import bantuinLogo from "../../../assets/images/bantuin-logo.png"
import { Divider } from '@nextui-org/divider'
import {Listbox, ListboxItem, ListboxSection} from "@nextui-org/listbox";
import { Link } from 'react-router-dom';



const Sidebar = () => {
  return (
    <div className='w-60 bg-white border fixed top-0 left-0 bottom-0 p-3 hidden sm:block z-10'>
      <div className=' flex items-center justify-center pb-3 '>
        <a href="/">
          <img src={bantuinLogo} className='h-12' alt="el-logo" />
        </a>
      </div>

      <Divider/>

      <div className='flex items-center justify-center py-2 text-xl'>
        
          <Listbox variant="flat" aria-label="Listbox menu with sections">
            <ListboxSection title="Dashboard" className='font-bold' >
               
              <ListboxItem
                key="products"
                textValue='Products'
                color='primary'
              >
                <Link to='/dashboard-partner' className='font-semibold text-[#989898]'>Daftar Pesanan</Link>
              </ListboxItem>

              <ListboxItem
                key="transaction"
                textValue='Transaction'
                color='primary'
                className='mt-1'
              >
                <Link to="/partner/history" className='font-semibold text-[#989898]'>Riwayat Pesanan</Link>
              </ListboxItem>
            </ListboxSection> 
            
          </Listbox>
        
      </div>
    </div>
  )
}

export default Sidebar