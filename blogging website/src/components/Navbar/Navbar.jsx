import React from 'react'
import logo from '@assets/logo.png'
import { Link, Outlet } from 'react-router-dom'
import { SearchBox } from './SearchBox';

export const Navbar = () => {

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
        <Link to='/signin' className='btn-dark py-2'>
          Sign In
        </Link>
        <Link to='/signup' className='btn-light py-2 hidden md:block'>
          Sign Up
        </Link>
      </nav>
      <Outlet />
    </>
  )
}
