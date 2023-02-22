import React, { useState } from 'react';
import { dbService, firebaseInstance, storageService } from 'fbase';
import { v4 as uuidv4 } from 'uuid';
import { faTimes, faImage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

const NweetFactory = ({ userObj }) => {
  // 타임스탬프 (한국시간)
  const TIME_ZONE = 3240 * 10000;
  const timestamp = firebaseInstance.firestore.Timestamp.fromDate(
    new Date(+new Date() + TIME_ZONE)
  )
    .toDate()
    .toISOString()
    .replace('T', ' ')
    .replace(/\..*/, '');
  const date = firebaseInstance.firestore.Timestamp.fromDate(new Date());

  // nweet Hooks
  const [nweet, setNweet] = useState('');
  const [attachment, setAttachment] = useState('');

  // Submit event
  const onSubmit = async (event) => {
    if (nweet === '') {
      return;
    }
    event.preventDefault();
    // 스토리지 버킷에 Nweet 이미지 폴더 만들기
    let attachmentUrl = '';
    if (attachment !== '') {
      // 파일 레퍼런스 만들기
      const attachmentRef = storageService
        .ref()
        .child(`${userObj.uid}/${uuidv4()}.jpg`);
      // 파일 업로드
      const response = await attachmentRef.putString(attachment, 'data_url');
      // Url 가져오기
      attachmentUrl = await response.ref.getDownloadURL();
    }
    const nweetObj = {
      text: nweet,
      createAt: timestamp,
      creatorId: userObj.uid,
      photoURL: userObj.photoURL,
      displayName: userObj.displayName,
      attachmentUrl,
    };
    await dbService.collection('nweets').add(nweetObj);

    setNweet('');
    setAttachment('');
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNweet(value);
  };
  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };
  const onClearAttachment = () => {
    setAttachment('');
  };
  return (
    <form onSubmit={onSubmit} className='factoryForm'>
      <div className='factoryInput__container'>
        <div className='factoryInput__left'>
          <Link
            to='/profile'
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              fontSize: 12,
            }}
          >
            <div className='main_profileImage'>
              <img
                src={userObj.photoURL}
                style={{
                  backgroundImage: userObj.photoURL,
                }}
                alt={userObj.displayName}
              />
            </div>
          </Link>
        </div>
        <div className='factoryInput__right'>
          <input
            className='factoryInput__input'
            value={nweet}
            onChange={onChange}
            type='text'
            placeholder='무슨 일이 일어나고 있나요?'
            maxLength={120}
          />
          <div className='factoryInput__nweetLine'>
            <label htmlFor='attach-file' className='factoryInput__label'>
              <FontAwesomeIcon icon={faImage} size='lg' title='media' />
              <input
                id='attach-file'
                type='file'
                accept='image/*'
                onChange={onFileChange}
                style={{
                  opacity: 0,
                }}
              />
            </label>
            <span onClick={onSubmit} className='factoryInput__nweetBtn'>
              트윗하기
            </span>
          </div>
        </div>
      </div>

      {attachment && (
        <div className='factoryForm__attachment'>
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
  );
};

export default NweetFactory;
