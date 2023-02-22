import { dbService, storageService } from 'fbase';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrash,
  faPencilAlt,
  faHeart as fasHeart,
} from '@fortawesome/free-solid-svg-icons';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';
import { format, register } from 'timeago.js';

const Nweet = ({ nweetObj, isOwner }) => {
  // timeago 한국어 세팅
  const localeFunc = (number, index) => {
    return [
      ['방금', '곧'],
      ['%s초', '%s초 후'],
      ['1분', '1분 후'],
      ['%s분', '%s분 후'],
      ['1시간', '1시간 후'],
      ['%s시간', '%s시간 후'],
      ['1일', '1일 후'],
      ['%s일', '%s일 후'],
      ['1주일', '1주일 후'],
      ['%s주일', '%s주일 후'],
      ['1개월', '1개월 후'],
      ['%s개월', '%s개월 후'],
      ['1년', '1년 후'],
      ['%s년', '%s년 후'],
    ][index];
  };
  register('my-locale', localeFunc);

  const [editing, setEditing] = useState(false);
  const [newNweet, setNewNweet] = useState(nweetObj.text);
  const [like, setLike] = useState(true);
  const [likeCount, setLikeCount] = useState(0);

  // Nweet 삭제
  const onDeleteClick = async () => {
    const ok = window.confirm('Are you sure you want to delete this nweet?');
    if (ok) {
      await dbService.doc(`nweets/${nweetObj.id}`).delete();
      await storageService.refFromURL(nweetObj.attachmentUrl).delete();
    }
  };
  // Nweet 수정 취소
  const toggleEditing = () => setEditing((prev) => !prev);
  // 새로운 Nweet 업데이트
  const onSubmit = async (event) => {
    event.preventDefault();
    await dbService.doc(`nweets/${nweetObj.id}`).update({
      text: newNweet,
    });
    setEditing(false);
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewNweet(value);
  };

  // TODO: 좋아요 기능
  const onLikeClick = async () => {
    const likeObj = {
      like: true,
      likeCount,
      displayName: nweetObj.displayName,
      attachmentUrl: nweetObj.attachmentUrl,
    };
    await dbService.collection('Like').doc('post1').set(likeObj);
    if (like) {
      // Like collection 갯수 카운팅
      setLikeCount(likeCount + 1);
      setLike(false);
    } else {
      setLikeCount(likeCount - 1);
      setLike(true);
    }
  };
  return (
    <div className='nweet'>
      {editing ? (
        <>
          <form onSubmit={onSubmit} className='container nweetEdit'>
            <input
              onChange={onChange}
              type='text'
              placeholder='Edit your nweet'
              value={newNweet}
              required
              autoFocus
              className='formInput'
            />
            <input type='submit' value='Update Nweet' className='formBtn' />
          </form>
          <span onClick={toggleEditing} className='formBtn cancelBtn'>
            Cancel
          </span>
        </>
      ) : (
        <div>
          <section>
            <article className='nweet_article'>
              <div className='nweet_profile'>
                <img
                  src={nweetObj.photoURL}
                  style={{
                    backgroundImage: nweetObj.photoURL,
                  }}
                  alt={nweetObj.displayName}
                />
              </div>
              <div className='nweet_text'>
                <div className='nweet_username'>
                  <span>{nweetObj.displayName}</span>
                  <span> {format(nweetObj.createAt, 'my-locale')}</span>
                </div>
                <h4>{nweetObj.text}</h4>
                {nweetObj.attachmentUrl && <img src={nweetObj.attachmentUrl} />}
                <div className='nweet_like' onClick={onLikeClick}>
                  <span>좋아요</span>
                  <div>
                    <FontAwesomeIcon icon={like ? farHeart : fasHeart} />
                    <span>{likeCount}</span>
                  </div>
                </div>
                {isOwner && (
                  <div className='nweet__actions'>
                    <span onClick={onDeleteClick}>
                      <FontAwesomeIcon icon={faTrash} />
                    </span>
                    <span onClick={toggleEditing}>
                      <FontAwesomeIcon icon={faPencilAlt} />
                    </span>
                  </div>
                )}
              </div>
            </article>
          </section>
        </div>
      )}
    </div>
  );
};

export default Nweet;
