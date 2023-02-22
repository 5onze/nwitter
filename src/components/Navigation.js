import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => (
  <nav className='center nav'>
    <ul className='container'>
      <li>
        <Link to='/' className='home'>
          <span>Home</span>
        </Link>
      </li>
    </ul>
  </nav>
);

export default Navigation;
