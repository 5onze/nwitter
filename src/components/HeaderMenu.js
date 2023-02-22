import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-regular-svg-icons';

const HeaderMenu = () => {
  return (
    <header>
      <div>
        <div className='headerIcon'>
          <Link to='/' className='home'>
            <FontAwesomeIcon icon={faTwitter} color={'#04AAFF'} size='lg' />
          </Link>
        </div>
        <nav>
          <div className='header_list'>
            <Link to='/' className='home'>
              <FontAwesomeIcon
                icon={faHome}
                className='header_fontAwesomeIcon'
              />
              <span>Home</span>
            </Link>
          </div>
          <div className='header_list'>
            <Link to='/profile' className='profile'>
              <FontAwesomeIcon
                icon={faUser}
                className='header_fontAwesomeIcon'
              />
              <span>Profile</span>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};
export default HeaderMenu;
