import lightPageNotFoundImg from '@assets/404-light.png';
import darkPageNotFoundImg from '@assets/404-dark.png';
import lightFullLogo from '@assets/full-logo-light.png';
import darkFullLogo from '@assets/full-logo-dark.png';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { authContext } from '../context/authContext';

const PageNotFound = () => {
  const { theme } = useContext(authContext);
  return (
    <section className='h-cover relative p-10 flex flex-col items-center gap-20 text-center'>
      <img src={theme === 'light' ? darkPageNotFoundImg : lightPageNotFoundImg} className='select-none border-2 border-grey w-72 aspect-square object-cover rounded' />
      <h1 className='text-4xl font-gelasio leading-7'>Page Not Found</h1>
      <p className='text-dark-grey text-xl leading-7'>The page you are looking for dose not exists. Head back to the <Link to={'/'} className='text-black underline'>Home Page</Link> </p>
      <div className='mt-auto'>
        <img src={theme === 'light' ? darkFullLogo : lightFullLogo} className='h-8 object-contain block mx-auto select-none' />
        <p className='mt-5 text-dark-grey'>Read millions of stories written by people like you</p>
      </div>
    </section>
  )
}

export default PageNotFound