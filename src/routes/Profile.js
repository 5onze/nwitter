import React, { useState } from 'react';
import { authService, storageService } from 'fbase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';

const Profile = ({ refreshUser, userObj }) => {
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const [attachment, setAttachment] = useState(userObj.photoURL);
  const onLogOutClick = () => {
    authService.signOut();
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    let attachmentUrl = userObj.photoURL;
    // 스토리지 버킷에 프로필 이미지 폴더 만들기
    if (attachment !== userObj.photoURL) {
      // 파일 레퍼런스(업로드 이전 상태) 만들기
      const attachmentRef = storageService
        .ref()
        .child(`${userObj.uid}/profile/profile.jpg`);
      // 파일 업로드
      const response = await attachmentRef.putString(attachment, 'data_url');
      // Url 가져오기
      attachmentUrl = await response.ref.getDownloadURL();
    }
    // 프로필 업데이트
    if (
      userObj.displayName !== newDisplayName ||
      userObj.photoURL !== attachment
    ) {
      await userObj.updateProfile({
        displayName: newDisplayName,
        photoURL: attachmentUrl,
      });
      refreshUser();
    }
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };
  // 이미지 url 받아오기
  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    // FileReader의 Instance 생성
    const reader = new FileReader();
    // 이벤트리스너
    reader.onload = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      // setAttachment state를 data_url 형식의 string 값으로 업데이트
      setAttachment(result);
    };
    if (theFile) {
      reader.readAsDataURL(theFile);
    }
  };
  // 프로필 이미지 제거
  const onClearAttachment = async () => {
    const ok = window.confirm(
      'Are you sure want to delete your profile picture?'
    );
    if (ok) {
      await storageService
        .ref()
        .child(`${userObj.uid}/profile/profile.jpg`)
        .delete();
    }
    setAttachment('');
  };
  return (
    <div className='container'>
      <form onSubmit={onSubmit} className='profileForm'>
        <input
          onChange={onChange}
          type='text'
          placeholder='Display name'
          value={newDisplayName}
          className='formInput'
          autoFocus
        />
        <input
          type='submit'
          value='Update Profile'
          className='formBtn profileForm__submit'
        />
        <label htmlFor='attach-file' className='profileInput__label'>
          <span>Add photos</span>
          <FontAwesomeIcon icon={faPlus} />
        </label>
        <input
          id='attach-file'
          type='file'
          accept='image/*'
          onChange={onFileChange}
          style={{
            opacity: 0,
          }}
        />
        {attachment && (
          <div className='factoryForm__attachment profileForm__attachment'>
            <img
              src={attachment}
              style={{
                backgroundImage: attachment,
              }}
            />
            <div className='factoryForm__clear' onClick={onClearAttachment}>
              <span>remove</span>
              <FontAwesomeIcon icon={faTimes} />
            </div>
          </div>
        )}
      </form>
      <span className='formBtn cancelBtn logOut' onClick={onLogOutClick}>
        Log Out
      </span>
    </div>
  );
};
export default Profile;
