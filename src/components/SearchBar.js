import { faEllipsis, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { dbService } from "fbase";
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";

// Focus Hook
const useFocus = (onFocus) => {
  const element = useRef();
  const [focus, setFocus] = useState(false);

  useEffect(() => {
    if (!element.current) {
      return;
    }
    const onFocus = () => setFocus(true);
    if (focus) {
      element.current.focus();
    }
    if (element.current) {
      element.current.addEventListener("focus", onFocus);
    }
    return () => {
      if (element.current) {
        element.current.removeEventListener("focus", onFocus);
      }
    };
  }, [focus, onFocus]);
  return element;
};
// 메인
const SearchBar = () => {
  const [nweets, setNweets] = useState([]);
  const [filterNweets, setFilterNweets] = useState([]);
  const [value, setValue] = useState(""); // 검색값
  const [toggle, setToggle] = useState(false); // 검색내용 드랍다운메뉴

  //포커스 기능
  const focusInput = useFocus(false);
  // input 클릭시 토글
  const onClick = () => setToggle(!toggle);
  // 검색 입력
  const onChange = (event) => {
    event.preventDefault();
    const {
      target: { value },
    } = event;
    setValue(value);
  };
  // 검색 기능
  useEffect(() => {
    // 트윗 내용 검색
    const nweetInfo = async () => {
      // 트윗 정보 가져오기
      dbService.collection("nweets").onSnapshot((snapshot) => {
        const nweetArray = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        // 입력값 트윗 검색 (필터링)
        const searchNweets = nweets?.filter((nweet) =>
          nweet.text.includes(value)
        );
        setNweets(nweetArray);
        setFilterNweets(searchNweets);
      });
    };
    nweetInfo();
  }, [nweets, value]);
  return (
    <div className="container nav search_width">
      <div className="search_bar" onClick={onClick}>
        <div className="search_icon">
          <label htmlFor="search_input">
            <div className="search_left">
              <FontAwesomeIcon icon={faSearch} className="faSearch" />
            </div>
            <input
              id="search_input"
              type="text"
              placeholder="Search nwitter"
              onChange={onChange}
              value={value}
              ref={focusInput}
            />
          </label>
        </div>
        {toggle && (
          <div className="search_list">
            <div>
              {value === "" && (
                <div className="search_try">
                  <span>Try searching for people, topics, or keywords</span>
                </div>
              )}
              {value !== "" && filterNweets?.length === 0 && (
                <div>
                  <span>Search for "{value}"</span>
                </div>
              )}
              {value !== "" &&
                filterNweets?.map((nweetObj) => (
                  <section key={nweetObj.id}>
                    <article className="nweet_article">
                      <div className="nweet_profile">
                        <img
                          src={nweetObj.photoURL}
                          style={{
                            backgroundImage: nweetObj.photoURL,
                          }}
                          alt={nweetObj.displayName}
                        />
                      </div>
                      <div className="nweet_text">
                        <div className="nweet_username">
                          <span>{nweetObj.displayName}</span>
                        </div>
                        <h4>{nweetObj.text}</h4>
                        {nweetObj.attachmentUrl && (
                          <img src={nweetObj.attachmentUrl} />
                        )}
                      </div>
                    </article>
                  </section>
                ))}
            </div>
          </div>
        )}
      </div>
      <div className="timeline">
        <h1>Trends for you</h1>
        <div className="trend">
          <div className="trend_lists">
            <div className="trend_kind">
              <span>Coding &middot; Trending</span>
            </div>
            <div className="trend_title">
              <span title="리액트">#리액트</span>
            </div>
            <div className="ellipsis_icon" title="more">
              <FontAwesomeIcon icon={faEllipsis} className="faEllipsis" />
            </div>
          </div>
          <div className="trend_lists">
            <div className="trend_kind">
              <span>Coding &middot; Trending</span>
            </div>
            <div className="trend_title">
              <span title="바닐라JS">#바닐라JS</span>
            </div>
            <div className="ellipsis_icon" title="more">
              <FontAwesomeIcon icon={faEllipsis} className="faEllipsis" />
            </div>
          </div>
          <div className="trend_lists">
            <div className="trend_kind">
              <span>Coding &middot; Trending</span>
            </div>
            <div className="trend_title">
              <span title="타입스크립트">#타입스크립트</span>
            </div>
            <div className="ellipsis_icon" title="more">
              <FontAwesomeIcon icon={faEllipsis} className="faEllipsis" />
            </div>
          </div>
        </div>
      </div>
      <div className="youMightLike">
        <h1>You might like</h1>
        <div className="youMightLike_lists">
          <div className="youMightLike_title">
            <div className="youMightLike_item">
              <div className="youMightLike_profile">
                <img
                  src="	https://pbs.twimg.com/profile_images/1235992718171467776/PaX2Bz1S_200x200.jpg"
                  alt="netflix"
                />
              </div>
              <div className="youMightLike_text">
                <div className="youMightLike_username">
                  <span>
                    <a href="https://twitter.com/netflix">Netflix</a>
                  </span>
                </div>
                <h4>@netflix</h4>
              </div>
              <div className="youMightLike_follow">
                <span>Follow</span>
              </div>
            </div>
          </div>
          <div className="youMightLike_title">
            <div className="youMightLike_item">
              <div className="youMightLike_profile">
                <img src="	https://nomadcoders.co/m.svg" alt="nomadcoders" />
              </div>
              <div className="youMightLike_text">
                <div className="youMightLike_username">
                  <span>
                    <a href="https://twitter.com/netflix">Nomadcoders</a>
                  </span>
                </div>
                <h4>@노마드코더</h4>
              </div>
              <div className="youMightLike_follow">
                <span>Follow</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .search_width {
          min-width: 350px;
          font-size: 16px;
          flex: 1;
          gap: 10px;
        }
        .search_bar {
          margin-bottom: 10px;
        }
        .search_icon,
        .timeline,
        .youMightLike {
          background-color: rgb(239, 243, 244);
        }
        .search_icon {
          border-radius: 30px;
          height: 44px;
        }
        .search_icon label {
          display: flex;
          align-items: center;
        }
        .search_icon:focus-within {
          border: 1px solid #04aaff;
          background-color: #fff;
        }
        .search_left {
          width: 44px;
          height: 44px;
          flex: 1;
          align-items: center;
          display: flex;
        }
        .faSearch {
          padding-left: 18px;
        }
        #search_input {
          width: 100%;
          height: 100%;
          padding: 10px;
          flex: 10;
        }
        /* 검색 결과 */
        .search_list {
          width: 374px;
          box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
          min-height: 100px;
          max-height: calc(80vh - 53px);
          overflow: auto;
          padding: 10px 0;
        }
        .search_try {
          padding: 20px 39px 10px 39px;
          font-size: 15px;
          color: #536471;
        }
        .timeline,
        .search_list,
        .youMightLike {
          border-radius: 10px;
        }
        .search_list img {
          width: 40px;
          height: auto;
          border-radius: 50%;
        }
        .timeline h1,
        .youMightLike h1 {
          font-weight: 800;
          font-size: 20px;
          color: #0f1419;
          margin-bottom: 10px;
          padding: 18px 18px 0 18px;
        }
        /* menu 1. Trend for you */
        .trend {
          position: relative;
          margin-bottom: 20px;
        }
        .trend_lists {
          cursor: pointer;
          display: flex;
          flex-direction: column;
          gap: 4px;
          position: relative;
          padding: 18px;
        }
        .trend_lists:hover {
          background-color: rgba(0, 0, 0, 0.03);
        }
        .trend_kind span {
          font-size: 13px;
          color: #536471;
        }
        .trend_title span {
          font-size: 15px;
          font-weight: 700;
          color: #0f1419;
        }
        .trend_title span:hover {
          text-decoration: underline;
        }
        .ellipsis_icon {
          position: absolute;
          top: 8px;
          right: 8px;
          cursor: pointer;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ellipsis_icon:hover {
          background-color: rgba(29, 155, 240, 0.1);
        }
        /* menu 2. You might like */
        .youMightLike_lists {
          cursor: pointer;
          margin-bottom: 20px;
        }
        .youMightLike_title {
          padding: 18px;
        }
        .youMightLike_title:hover {
          background-color: rgba(0, 0, 0, 0.03);
        }
        .youMightLike_item {
          display: flex;
          font-size: 15px;
        }
        .youMightLike_profile {
          flex: 1;
        }
        .youMightLike_text {
          flex: 2 2 16%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          margin-bottom: 4px;
        }
        .youMightLike_username {
          color: #0f1419;
          font-weight: 700;
          font-size: 15px;
          margin-bottom: 4px;
        }
        .youMightLike_username:hover {
          text-decoration: underline;
        }
        .youMightLike_text h4 {
          color: #536471;
          font-size: 13px;
        }
        .youMightLike_profile img {
          width: 48px;
          height: 48px;
          border-radius: 5px;
        }
        .youMightLike_follow {
          display: flex;
          width: 78px;
          height: 32px;
          align-items: center;
          justify-content: center;
          border-radius: 20px;
          background: rgb(15, 20, 25);
          color: #fff;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default SearchBar;
