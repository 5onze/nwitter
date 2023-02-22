import React from 'react';
import { authService, firebaseInstance } from 'fbase';
import AuthForm from 'components/AuthForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTwitter,
  faGoogle,
  faGithub,
} from '@fortawesome/free-brands-svg-icons';

const Auth = () => {
  // 소셜 로그인
  const onSocialClick = async (event) => {
    const {
      target: { name },
    } = event;
    let provider;
    if (name === 'google') {
      provider = new firebaseInstance.auth.GoogleAuthProvider();
    } else if (name === 'github') {
      provider = new firebaseInstance.auth.GithubAuthProvider();
    }
    await authService.signInWithPopup(provider);
  };
  return (
    <div className='authContainer'>
      <FontAwesomeIcon
        icon={faTwitter}
        color={'#04AAFF'}
        size='3x'
        style={{ marginBottom: 30 }}
      />
      <h1>트위터에 로그인하기</h1>
      <div className='authBtns'>
        <button onClick={onSocialClick} name='google' className='authBtn'>
          <FontAwesomeIcon icon={faGoogle} size='lg' />
          <span>Google 계정으로 로그인</span>
        </button>
        <button onClick={onSocialClick} name='github' className='authBtn'>
          <FontAwesomeIcon icon={faGithub} size='lg' />
          <span>Github 계정으로 로그인</span>
        </button>
        <button name='signup' className='authBtn'>
          <span>이메일 주소로 가입하기</span>
        </button>
      </div>
      <div className='authLine'>
        <hr />
      </div>
      <AuthForm />
    </div>
  );
};
export default Auth;
