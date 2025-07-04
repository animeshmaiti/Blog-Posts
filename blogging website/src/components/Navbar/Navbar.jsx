import { useContext, useEffect, useState } from 'react'
import darkLogo from '@assets/logo-dark.png'
import lightLogo from '@assets/logo-light.png'
import { Link, Outlet } from 'react-router-dom'
import { SearchBox } from './SearchBox';
import { authContext } from '../../context/authContext';
import { UserNavigationPanel } from '../UserNavigation/UserNavigationPanel';
import axios from 'axios';

export const Navbar = () => {
  const { isValid, authUser, setAuthUser, theme, setTheme } = useContext(authContext);
  const { profile_img, new_notification_available } = authUser || {};
  const [userNavPanel, setUserNavPanel] = useState(false);

  const handleBlur = () => {
    setTimeout(() => {
      setUserNavPanel(false)
    }, 200)
  }
  useEffect(() => {
    if (isValid) {
      axios.get('http://localhost:3000/api/notification/new-notifications', {
        withCredentials: true
      }).then(({ data }) => {
        setAuthUser(prev => ({ ...prev, ...data }));
      }).catch(err => {
        console.error('Error fetching notifications:', err);
      });
    }
  }, [isValid]);
  const handleThemeChange = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    document.body.setAttribute('data-theme', newTheme);
    setTheme(newTheme);
    sessionStorage.setItem('theme', newTheme);
  }
  return (
    <>
      <nav className='navbar z-50'>
        <Link to='/' className='flex-none w-10'>
          <img src={theme == 'light' ? darkLogo : lightLogo} alt='logo' className='w-full' />
        </Link>
        <SearchBox />
        <Link to='/editor' className='hidden md:flex gap-2 link'>
          <i className="fi fi-rr-file-edit"></i>
          <p>Write</p>
        </Link>
        <button className='w-12 h-12 rounded-full bg-grey relative hover:bg-black/10' onClick={handleThemeChange}>
          <i className={`fi fi-rr-${theme=='light'?'moon-stars':'sun'} text-2xl block mt-1`}></i>
        </button>
        {
          isValid ?
            <>
              <Link to='/dashboard/notifications'>
                <button className='w-12 h-12 rounded-full bg-grey relative hover:bg-black/10'>
                  <i className='fi fi-rr-bell text-2xl block mt-1'></i>
                  {
                    new_notification_available && <span className='bg-red w-3 h-3 rounded-full absolute z-10 top-2 right-2'></span>
                  }
                </button>
              </Link>
              <div className='relative' onClick={() => setUserNavPanel(!userNavPanel)} onBlur={handleBlur}>
                <button className='w-12 h-12 mt-1'>
                  <img src={profile_img} alt='img' className='w-full h-full object-cover rounded-full' referrerPolicy='no-referrer' />
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
