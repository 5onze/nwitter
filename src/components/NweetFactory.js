import React, { useState } from 'react';
import { dbService, storageService } from 'fbase';
import { v4 as uuidv4 } from 'uuid';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const NweetFactory = ({ userObj }) => {
  const [nweet, setNweet] = useState('');
  const [attachment, setAttachment] = useState('');
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
        .child(`${userObj.uid}/${uuidv4()}`);
      // 파일 업로드
      const response = await attachmentRef.putString(attachment, 'data_url');
      // Url 가져오기
      attachmentUrl = await response.ref.getDownloadURL();
    }
    const nweetObj = {
      text: nweet,
      createAt: Date.now(),
      creatorId: userObj.uid,
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
        <input
          className='factoryInput__input'
          value={nweet}
          onChange={onChange}
          type='text'
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input type='submit' value='&rarr;' className='factoryInput__arrow' />
      </div>
      <label htmlFor='attach-file' className='factoryInput__label'>
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
