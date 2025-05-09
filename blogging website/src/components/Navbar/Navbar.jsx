import React, { useContext, useState } from 'react'
import logo from '@assets/logo.png'
import { Link, Outlet } from 'react-router-dom'
import { SearchBox } from './SearchBox';
import { authContext} from '../../context/authContext';
import { UserNavigationPanel } from '../UserNavigation/UserNavigationPanel';

export const Navbar = () => {
  const { isValid, authUser } = useContext(authContext);
  const { profile_img, username, email } = authUser || {};
  const [userNavPanel, setUserNavPanel] = useState(false);

  const handleBlur = () => {
    setTimeout(()=>{
      setUserNavPanel(false)
    },200)
  }

  return (
    <>
      <nav className='navbar'>
        <Link to='/' className='flex-none w-10'>
          <img src={logo} alt='logo' className='w-full' />
        </Link>
        <SearchBox />
        <Link to='/editor' className='hidden md:flex gap-2 link'>
          <i className="fi fi-rr-file-edit"></i>
          <p>Write</p>
        </Link>
        {
          isValid ?
            <>
              <Link to='/dashboard/notifications'>
                <button className='w-12 h-12 rounded-full bg-grey relative hover:bg-black/10'>
                  <i className='fi fi-rr-bell text-2xl block mt-1'></i>
                </button>
              </Link>
              <div className='relative' onClick={() => setUserNavPanel(!userNavPanel)} onBlur={handleBlur}>
                <button className='w-12 h-12 mt-1'>
                  <img src={authUser?.profile_img} alt='img' className='w-full h-full object-cover rounded-full' referrerPolicy='no-referrer'/>
                </button>
                {
                  userNavPanel ? <UserNavigationPanel />
                    : ""
                }
              </div>
            </>
            : <>
              <Link to='/signin' className='btn-dark py-2'>
                Sign In
              </Link>
              <Link to='/signup' className='btn-light py-2 hidden md:block'>
                Sign Up
              </Link>
            </>
        }

      </nav>
      <Outlet />
    </>
  )
}
