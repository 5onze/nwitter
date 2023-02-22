import React, { useState } from 'react';
import { authService } from 'fbase';

const AuthForm = () => {
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  // const [username, setUsername] = useState('');
  const [authObj, setAuthObj] = useState({
    email: '',
    password: '',
    displayName: '',
  });
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState('');
  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;
    setAuthObj((authObj) => ({ ...authObj, [name]: value }));
  };
  // 유저 로그인 or 가입
  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      let data;
      if (newAccount) {
        // log in
        data = await authService.signInWithEmailAndPassword(
          authObj.email,
          authObj.password
        );
      } else {
        // create account
        data = await authService.createUserWithEmailAndPassword(
          authObj.email,
          authObj.password
        );
        // profile 업데이트
        await data.user.updateProfile({
          displayName: authObj.displayName,
          photoURL:
            'https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png',
        });
      }
    } catch (error) {
      setError(error.message);
    }
  };
  const toggleAccount = () => setNewAccount((prev) => !prev);
  return (
    <>
      <form onSubmit={onSubmit} className='container'>
        <input
          name='displayName'
          type='text'
          placeholder='이름'
          required
          value={authObj.displayName}
          onChange={onChange}
          className='authInput'
          maxLength='50'
        />
        <input
          name='email'
          type='text'
          placeholder='이메일 주소를 입력하세요'
          required
          value={authObj.email}
          onChange={onChange}
          className='authInput'
        />
        <input
          name='password'
          type='password'
          placeholder='비밀번호를 입력하세요'
          required
          value={authObj.password}
          onChange={onChange}
          className='authInput'
        />
        <input
          type='submit'
          value={newAccount ? '다음' : '가입하기'}
          className='authInput authSubmit'
        />
        {error && <span className='authError'>{error}</span>}
      </form>
      <div className='authSignIn'>
        <span>계정이 없으신가요?</span>
        <span onClick={toggleAccount} className='authSwitch'>
          {newAccount ? '가입하기' : '다음'}
        </span>
      </div>
    </>
  );
};

export default AuthForm;
