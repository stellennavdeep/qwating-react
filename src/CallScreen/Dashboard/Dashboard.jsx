import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Pusher from "pusher-js";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Dashboard = () => {
  const [trasferUpdate,setTransferUpdate] = useState(
    {pusher: "",
     tranferCount: 0, 
    }
  );
  const [visitors, setVisitors] = useState([]);
  const [counters, setCounters] = useState([]);
  const [currentCall, setCurrentCall] = useState([]);
  const [missedcall, setMissedcall] = useState([]);
  const [categories, setCategories] = useState([]);
  const [nameuser, setNameUser] = useState("");
  const [selectedCounter, setSelectedCounter] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [transferPopup, setTransferPopup] = useState(false);
  const [nextbtnData, setNextbtnData] = useState([]);
  const [currentCallId, setCurrentCallId] = useState("");
  const [refresh, setRefresh] = useState([]);
  const [popupData, setPopupData] = useState([]);
  const [loading, setLoading] = useState(false);
  const currentDate = new Date();
  const [currentTime, setCurrentTime] = useState(new Date());
  const formattedDate = `${currentTime.toDateString()} ${currentTime.toLocaleTimeString()}`;

  const comments = JSON.parse(localStorage.getItem("dashboardData"));
  const loginUserId = comments?.login_user?.Client?.id;
  const loginDomainId = comments?.login_user?.Client?.domainId;
  const storedNameUser = comments?.login_user?.Client?.name;
  const pusherapikey = comments?.detail?.pusher_api_key;
  const pushercluster = comments?.detail?.pusher_cluster;
  const event = comments?.channel_name;
  const channelName = comments?.site;


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1400);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setNameUser(storedNameUser);
    if (!loginUserId) {
      localStorage.clear();
      window.location.href = "/";
      return;
    }

    const fetchCurrentCallData = async () => {
      setLoading(true);
      try {
        const response = await axios.post("/api/current_call", {
          login_user_id: loginUserId,
        });

        if (response.status !== 200) {
          throw new Error("Network response was not ok");
        }

        const data = await response.data;

        if (
          typeof data.current_serving === "object" &&
          data.current_serving !== null
        ) {
          const currentArray = [data.current_serving.Call];
          setCurrentCall(currentArray);
          setCurrentCallId(data.current_serving.Call.id);
        } else {
          console.error(
            "Current serving data is not in the expected format:",
            data.current_serving
          );
        }
      } catch (error) {
        console.error("Error fetching current call data:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCategoriesData = async () => {
      setLoading(true);
      try {
        const response = await axios.post("/api/get_categories_list", {
          domainId: loginDomainId,
        });
        if (response.status !== 200) {
          throw new Error("Network response was not ok");
        }
        const data = await response.data.categories;
        setCategories(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchMissedData = async () => {
      setLoading(true);
      try {
        const response = await axios.post("/api/getMissedCalls", {
          userId: loginUserId,
          domainId: loginDomainId,
        });

        if (response.status !== 200) {
          throw new Error("Network response was not ok");
        }
        const data = await response.data;
        setMissedcall(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.post("/api/getVisitorsList", {
          login_user_id: loginUserId,
        });

        if (response.status !== 200) {
          throw new Error("Network response was not ok");
        }
        const data = await response.data;
        setVisitors(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCountersData = async () => {
      setLoading(true);
      try {
        const response = await axios.post("/api/getCounters", {
          domainId: loginDomainId,
        });

        if (response.status !== 200) {
          throw new Error("Network response was not ok");
        }
        const data = await response.data;
        const countersArray = data.counters.map((item) => item.Counter);
        setCounters(countersArray);
        // setCurrentCall(data.currentCall || []);
      } catch (error) {
        console.error("Error fetching counters data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (loginUserId) {
      fetchData();
      fetchCountersData();
      fetchCurrentCallData();
      fetchMissedData();
      fetchCategoriesData();

      const pusher = new Pusher(pusherapikey, {
        cluster: pushercluster,
      });
      Pusher.logToConsole = true;
      const channel = pusher.subscribe(channelName);
      channel.bind(event, (data) => {
        setTransferUpdate(prevState => ({
          ...prevState,
          pusher: data,
        }));
        setVisitors(data.visitors || []);
          (data.counters || []);
        setCurrentCall(data.currentCall || []);
        // console.log(data, "Pusher Data");
      });

      // Cleanup
      return () => {
        channel.unbind_all();
        pusher.disconnect();
      };
    } else {
      console.error("No login user ID found");
    }
  }, [trasferUpdate]);

  useEffect(() => {
    if (showPopup) {
      const timeout = setTimeout(() => {
        setShowPopup(false);
      }, 2500);

      return () => clearTimeout(timeout);
    }
  }, [showPopup]);

  const fetchTransferData = async (CategoryId) => {
    setLoading(true);
    try {
      const response = await axios.post("/api/transfer_call", {
        userId: loginUserId,
        callId: currentCallId,
        domainId: loginDomainId,
        categoryId: CategoryId,
      });
      if (response.status !== 200) {
        throw new Error("Network response was not ok");
      }
      setNextbtnData(response.data);
      setTransferPopup(false);
      setShowPopup(true);
      setTransferUpdate(prevState => ({
        ...prevState,
        tranferCount: prevState.tranferCount + 1,
      }));
      
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fatchTakecallBtn = async (callId) => {
    setLoading(true);
    try {
      const response = await axios.post("/api/take_skip_call", {
        userId: loginUserId,
        domainId: loginDomainId,
        callId: callId,
        selected_counter: selectedCounter,
      });
      if (response.status !== 200) {
        throw new Error("Network response was not ok");
      }
      setNextbtnData(response.data);
      setShowPopup(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fatchNextBtn = async () => {
    if (!selectedCounter) {
      toast.error("Please select a counter");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post("/api/next_call", {
        userId: loginUserId,
        domainId: loginDomainId,
        selected_counter: selectedCounter,
      });
      if (response.status !== 200) {
        throw new Error("Network response was not ok");
      }
      setNextbtnData(response.data);
      setShowPopup(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDataa = async (endpoint) => {
    setLoading(true);
    try {
      const response = await axios.post(endpoint, {
        userId: loginUserId,
        domainId: loginDomainId,
        callId: currentCallId,
      });

      if (response.status !== 200) {
        throw new Error("Network response was not ok");
      }
      setNextbtnData(response.data);
      setShowPopup(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fatchCloseBtn = () => fetchDataa("/api/close_call");
  const fatchRecallBtn = () => fetchDataa("/api/re_call");
  const fatchSkipcallBtn = () => fetchDataa("/api/skip_call");

  const handleClearLocalStorage = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const handleSelectChange = (event) => {
    setSelectedCounter(event.target.value);
  };

  return (
    <>
      <div className="main-container">
        <div className="top-header">
          <div className="logo-top">
            <div className="logo-image">
              <Link to="/dashboard">
                <img
                  src="https://jimdemo.qwaiting.com/images/equeue-logo.png"
                  alt="Logo"
                />
              </Link>
            </div>
          </div>
          <div className="nav-bar-right">
            <ul>
              <li>
                {/* <button
                  className="btn theme-background refresh_screen"
                  onClick={handleRefreshClick}
                >
                  Refresh
                </button> */}
              </li>
              <li className="hide-mobiles">
                Counter:
                {counters.length > 0 ? (
                  <select value={selectedCounter} onChange={handleSelectChange}>
                    <option value="">Select a counter</option>
                    {counters.map((counter) => (
                      <option key={counter.id} value={counter.id}>
                        {counter.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <select>
                    <option>Select a counter</option>
                  </select>
                )}
              </li>
              <li className="hide-mobile">{nameuser}</li>
              <li className="hide-mobile">
                <span>{formattedDate}</span>
              </li>
              <li>
                <button onClick={handleClearLocalStorage}>
                  <span className="fas fa-power-off">
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 32 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_137_2)">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M18 4C18 3.46957 17.7893 2.96086 17.4142 2.58579C17.0391 2.21071 16.5304 2 16 2C15.4696 2 14.9609 2.21071 14.5858 2.58579C14.2107 2.96086 14 3.46957 14 4V17.3333C14 17.8638 14.2107 18.3725 14.5858 18.7475C14.9609 19.1226 15.4696 19.3333 16 19.3333C16.5304 19.3333 17.0391 19.1226 17.4142 18.7475C17.7893 18.3725 18 17.8638 18 17.3333V4ZM10.472 7.66667C10.6909 7.52125 10.879 7.33415 11.0255 7.11604C11.1721 6.89794 11.2742 6.6531 11.3262 6.39551C11.3781 6.13792 11.3788 5.87262 11.3282 5.61476C11.2776 5.35691 11.1768 5.11154 11.0313 4.89267C10.8859 4.6738 10.6988 4.48571 10.4807 4.33915C10.2626 4.19259 10.0178 4.09042 9.76018 4.03849C9.50259 3.98655 9.23729 3.98585 8.97943 4.03644C8.72157 4.08703 8.47621 4.18792 8.25734 4.33333C6.33198 5.60997 4.75282 7.34363 3.66093 9.37945C2.56903 11.4153 1.9984 13.6899 2 16C2 23.732 8.268 30 16 30C23.732 30 30 23.732 30 16C30 11.128 27.5107 6.84 23.7427 4.33333C23.3006 4.03983 22.7601 3.93394 22.24 4.03896C21.7199 4.14398 21.2628 4.45131 20.9693 4.89333C20.6758 5.33536 20.5699 5.87588 20.675 6.39598C20.78 6.91608 21.0873 7.37316 21.5293 7.66667C23.3195 8.85419 24.6796 10.5866 25.4083 12.6074C26.1371 14.6282 26.1957 16.83 25.5756 18.8867C24.9554 20.9435 23.6894 22.7458 21.965 24.0269C20.2406 25.308 18.1495 25.9998 16.0013 25.9998C13.8531 25.9998 11.762 25.308 10.0377 24.0269C8.31328 22.7458 7.04728 20.9435 6.42712 18.8867C5.80695 16.83 5.86558 14.6282 6.59433 12.6074C7.32309 10.5866 8.68188 8.85419 10.472 7.66667Z"
                          fill="white"
                        />
                      </g>
                      <defs>
                        <clip-path id="clip0_137_2">
                          <rect width="32" height="32" fill="white" />
                        </clip-path>
                      </defs>
                    </svg>
                  </span>
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="main-container-display">
          <div className="current-serving-element">
            <div className="display_table">
              <div className="left-section">
                <div className="box-in main-token-display">
                  <div className="content-inside">
                    <ul className="special-events">
                      <li>
                        <a href="#">
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M12 9C11.2044 9 10.4413 9.31607 9.87868 9.87868C9.31607 10.4413 9 11.2044 9 12C9 12.7956 9.31607 13.5587 9.87868 14.1213C10.4413 14.6839 11.2044 15 12 15C12.7956 15 13.5587 14.6839 14.1213 14.1213C14.6839 13.5587 15 12.7956 15 12C15 11.2044 14.6839 10.4413 14.1213 9.87868C13.5587 9.31607 12.7956 9 12 9ZM12 17C10.6739 17 9.40215 16.4732 8.46447 15.5355C7.52678 14.5979 7 13.3261 7 12C7 10.6739 7.52678 9.40215 8.46447 8.46447C9.40215 7.52678 10.6739 7 12 7C13.3261 7 14.5979 7.52678 15.5355 8.46447C16.4732 9.40215 17 10.6739 17 12C17 13.3261 16.4732 14.5979 15.5355 15.5355C14.5979 16.4732 13.3261 17 12 17ZM12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5Z"
                              fill="#337AB7"
                            />
                          </svg>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M1.12671e-06 10C0.000502681 7.8076 0.721484 5.67612 2.05199 3.9336C3.38249 2.19107 5.24877 0.934084 7.3636 0.35608C9.47844 -0.221924 11.7246 -0.0889077 13.7565 0.734659C15.7883 1.55822 17.4932 3.0267 18.6087 4.91407C19.7243 6.80145 20.1886 9.00312 19.9304 11.1803C19.6721 13.3574 18.7055 15.3893 17.1794 16.9633C15.6533 18.5374 13.6521 19.5662 11.484 19.8916C9.31588 20.2169 7.10092 19.8207 5.18 18.764L1.292 19.948C1.11858 20.0008 0.934066 20.0055 0.758187 19.9616C0.582309 19.9176 0.421685 19.8267 0.293496 19.6985C0.165308 19.5703 0.074377 19.4097 0.0304305 19.2338C-0.0135161 19.0579 -0.00882534 18.8734 0.044001 18.7L1.228 14.806C0.42153 13.3326 -0.000796137 11.6797 1.12671e-06 10ZM6 9C6 9.26522 6.10536 9.51957 6.29289 9.70711C6.48043 9.89465 6.73478 10 7 10H13C13.2652 10 13.5196 9.89465 13.7071 9.70711C13.8946 9.51957 14 9.26522 14 9C14 8.73479 13.8946 8.48043 13.7071 8.2929C13.5196 8.10536 13.2652 8 13 8H7C6.73478 8 6.48043 8.10536 6.29289 8.2929C6.10536 8.48043 6 8.73479 6 9ZM7 12C6.73478 12 6.48043 12.1054 6.29289 12.2929C6.10536 12.4804 6 12.7348 6 13C6 13.2652 6.10536 13.5196 6.29289 13.7071C6.48043 13.8946 6.73478 14 7 14H11C11.2652 14 11.5196 13.8946 11.7071 13.7071C11.8946 13.5196 12 13.2652 12 13C12 12.7348 11.8946 12.4804 11.7071 12.2929C11.5196 12.1054 11.2652 12 11 12H7Z"
                              fill="#337AB7"
                            />
                          </svg>
                        </a>
                      </li>
                    </ul>

                    {currentCall.length > 0 &&
                      currentCall.map((call, index) => {
                        return call?.token ? (
                          <div key={index}>
                            <h3>Current Serving</h3>
                            <h2 className="theme-color">Queue Number</h2>
                            <h1 className="theme-color">{call.token} </h1>
                            <h4>Serving Time</h4>
                            <h5 id="realtime">{call.created}</h5>
                            <h3>GET TOKEN-&gt;HR </h3>
                            <h3>Counter: {call.counter}</h3>
                            {/* <h3>id: {call.id}</h3> */}
                          </div>
                        ) : (
                          <p key={index}>No active calls</p>
                        );
                      })}
                  </div>
                </div>
              </div>
              <div className="middle-section">
                <ul>
                  <li>
                    <button onClick={fatchNextBtn} className="button">
                      Next
                    </button>
                  </li>

                  {currentCall.length > 0 &&
                    currentCall.map(
                      (call, index) =>
                        call?.token && (
                          <div key={index}>
                            <li>
                              <button
                                className="button"
                                onClick={() => setTransferPopup(true)}
                              >
                                Transfer
                              </button>
                            </li>
                            <li>
                              <button
                                onClick={fatchCloseBtn}
                                className="button"
                              >
                                Close
                              </button>
                            </li>
                            <li>
                              <button
                                onClick={fatchSkipcallBtn}
                                className="button"
                              >
                                Skip
                              </button>
                            </li>
                            <li>
                              <button
                                onClick={fatchRecallBtn}
                                className="button"
                              >
                                Recall
                              </button>
                            </li>
                          </div>
                        )
                    )}
                </ul>
              </div>
            </div>
          </div>
          <div className="right-section">
            <div className="department">
              <div className="visiter-info">
                <div className="visitors theme-background">
                  {visitors.length} Visitors are waiting
                </div>
                <ul className="data-service visitor-list-li">
                  {Array.isArray(visitors) &&
                    visitors.map((visitor) => (
                      <li key={visitor.Call.id}>
                        <div>
                          <strong>Queue Number:</strong> {visitor.Call.token}
                        </div>
                        <div>
                          <strong>contact:</strong> {visitor.Call.contact}
                        </div>
                        <div>
                          <strong>Issue Date:</strong> {visitor.Call.created}
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="footer">
          <div className="previously-served queue_no full-width missed">
            <h3 className="theme-background">
              <strong>Missed Queue: </strong>{" "}
              {missedcall?.missed_queues?.length > 0 ? (
                missedcall.missed_queues.map((queue, index) => {
                  const call = queue.Call;
                  return call?.token ? (
                    <button
                      onClick={() => fatchTakecallBtn(call.id)}
                      key={index}
                    >
                      {call.token} <em>,</em>
                    </button>
                  ) : (
                    <span key={index}>Missed Queue:</span>
                  );
                })
              ) : (
                <span></span>
              )}
            </h3>
          </div>
        </div>
      </div>

      <Popup open={showPopup} onClose={() => setShowPopup(false)} modal>
        <div className="modal-content nextbtn_popup">
          {nextbtnData.message ? (
            <div>
              <strong>{nextbtnData.message}</strong>
            </div>
          ) : (
            <p>No messages to show</p>
          )}
          <button
            onClick={() => setShowPopup(false)}
            className="button popup_close"
          >
            x
          </button>
        </div>
      </Popup>

      <Popup open={transferPopup} onClose={() => setTransferPopup(false)} modal>
        <div className="modal-content transfer_popup">
          <ul>
            {categories.map((category, index) => (
              <li key={index}>
                <button
                  className="button"
                  onClick={() => fetchTransferData(category.Category.id)}
                  key={index}
                >
                  {category.Category.name}
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={() => setTransferPopup(false)}
            className="button popup_close"
          >
            x
          </button>
        </div>
      </Popup>
      {loading && (
       <div className="loadmain"><div className="loader"></div></div>
      )}

      <ToastContainer />
    </>
  );
};

export default Dashboard;
