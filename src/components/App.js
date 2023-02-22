import React, { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { authService, dbService } from "fbase";
import { Helmet } from "react-helmet-async";

function App() {
  // 앱 초기화
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
    // 현재 로그인한 사용자 가져오기
    authService.onAuthStateChanged((user) => {
      if (user) {
        // users 컬렉션 생성
        // 가입 날짜
        const createDate = user.metadata.creationTime;
        //FIXME: profile displayName null
        //FIXME: createDate 날짜 포맷
        dbService
          .collection("users")
          .doc(user.uid)
          .set({
            displayName: user.displayName,
            photoURL: user.photoURL,
            uid: user.uid,
            email: user.email,
            profileId: `@${user.displayName}${Math.random()
              .toString(10)
              .substring(2, 10)}`,
            createDate,
          });
        user.updateProfile({
          displayName: user.displayName,
          photoURL: user.photoURL,
        });
        // nweet 할때 유저정보 저장
        setUserObj({
          displayName: user.displayName,
          photoURL: user.photoURL,
          uid: user.uid,
          email: user.email,
          profileId: `@${user.displayName}${Math.random()
            .toString(10)
            .substring(2, 10)}`,
          createDate,
          updateProfile: (args) => user.updateProfile(args),
        });
      } else {
        setUserObj(null);
      }
      setInit(true);
    });
  }, []);
  // 유저정보 업데이트
  const refreshUser = () => {
    const user = authService.currentUser;
    // 가입 날짜
    const createDate = user.metadata.creationTime;
    setUserObj({
      displayName: user.displayName,
      photoURL: user.photoURL,
      uid: user.uid,
      email: user.email,
      profileId: `@${user.displayName}${Math.random()
        .toString(10)
        .substring(2, 10)}`,
      createDate,
      updateProfile: (args) => user.updateProfile(args),
    });
  };
  return (
    <>
      {init ? (
        <AppRouter
          refreshUser={refreshUser}
          isLoggedIn={Boolean(userObj)}
          userObj={userObj}
        />
      ) : (
        "Initializing..."
      )}
    </>
  );
}

export default App;
