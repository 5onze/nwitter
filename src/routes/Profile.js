import React, { useState } from "react";
import { authService, storageService } from "fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { faCalendarDays } from "@fortawesome/free-regular-svg-icons";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import Seo from "components/Seo";

const Profile = ({ refreshUser, userObj }) => {
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const [profilePhoto, setProfilePhoto] = useState(userObj.photoURL);
  const [modal, setModal] = useState(false);

  // TODO: modal 창
  // TODO: add photos, remove icon
  // TODO: close 버튼
  const Modal = () => setModal((prev) => !prev);

  // 로그아웃
  const onLogOutClick = () => {
    authService.signOut();
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    let profilePhotoUrl = userObj.photoURL;
    // 스토리지 버킷에 프로필 이미지 폴더 만들기
    if (profilePhoto !== userObj.photoURL) {
      // 파일 레퍼런스(업로드 이전 상태) 만들기
      const profilePhotoRef = storageService
        .ref()
        .child(`${userObj.uid}/${userObj.uid}_profile_pick.jpg`);
      // 파일 업로드
      const response = await profilePhotoRef.putString(
        profilePhoto,
        "data_url"
      );
      // Url 가져오기
      profilePhotoUrl = await response.ref.getDownloadURL();
    }
    // 프로필 업데이트
    if (
      userObj.displayName !== newDisplayName ||
      userObj.photoURL !== profilePhoto
    ) {
      await userObj.updateProfile({
        displayName: newDisplayName,
        photoURL: profilePhotoUrl,
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
      // setProfilePhoto state를 data_url 형식의 string 값으로 업데이트
      setProfilePhoto(result);
    };
    if (theFile) {
      reader.readAsDataURL(theFile);
    }
  };
  // 프로필 이미지 제거
  const onClearAttachment = async () => {
    const ok = window.confirm(
      "Are you sure want to delete your profile picture?"
    );
    if (ok) {
      await storageService
        .ref()
        .child(`${userObj.uid}/${userObj.uid}_profile_pick.jpg`)
        .delete();
    }
    // 기본 프로필 이미지
    setProfilePhoto(
      "https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png"
    );
  };
  return (
    <div className="container">
      <Seo title="Profile" />
      <form onSubmit={onSubmit} className="profileForm">
        {profilePhoto && (
          <div className="profileForm__attachment">
            <img
              src={profilePhoto}
              style={{
                backgroundImage: profilePhoto,
              }}
              alt="profile"
            />
          </div>
        )}
        <button className="setProfile" onClick={Modal}>
          Set up profile
        </button>
        <input
          id="attach-file"
          type="file"
          accept="image/*"
          onChange={onFileChange}
          style={{
            opacity: 0,
          }}
        />
        <div className="profile_info">
          <h1>{userObj.displayName}</h1>
          <span>{userObj.profileId}</span>
          <div>
            <FontAwesomeIcon icon={faCalendarDays} />
            <span> Joined {userObj.createDate}</span>
          </div>
        </div>
      </form>
      <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
        Log Out
      </span>
      {modal ? (
        <div className="Modal_container">
          <div className="modal">
            <div className="modal_center">
              <FontAwesomeIcon icon={faTwitter} size="2x" color="#04aaff" />
              <div className="modal_title">
                <h1>Pick a profile picture</h1>
                <span>Have a favorite selfie? Upload it now.</span>
              </div>
              {profilePhoto && (
                <div className="modal_profilePhoto">
                  <div className="modal_profilePhoto_box">
                    <img
                      src={profilePhoto}
                      style={{
                        backgroundImage: profilePhoto,
                      }}
                      alt="profile"
                    />
                  </div>
                </div>
              )}
              <label htmlFor="attach-file" className="profileInput__label">
                <span>Add photos</span>
                <FontAwesomeIcon icon={faPlus} />
              </label>
              <div className="factoryForm__clear" onClick={onClearAttachment}>
                <span>remove</span>
                <FontAwesomeIcon icon={faTimes} />
              </div>
              <input
                onChange={onChange}
                type="text"
                placeholder="Display name"
                value={newDisplayName}
                className="formInput"
                autoFocus
              />
              <input
                type="submit"
                value="Update Profile"
                className="formBtn profileForm__submit"
              />
            </div>
          </div>
        </div>
      ) : (
        true
      )}
    </div>
  );
};
export default Profile;
