import React, { useState } from "react";
import axios from "axios";
import qs from "qs";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = qs.stringify({
      username: username,
      password: password,
    });

    try {
      const response = await axios.post("https://moi.saasdevteam.com/api/login_by_staff", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      if (response.data.status === "success") {
        setError(false);
        toast.success("Login successful!");
        localStorage.setItem('dashboardData', JSON.stringify(response.data));
        navigate("/dashboard");
      } else {
        setError(true);
        toast.error("Login failed. Please check your credentials.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred during login.");
      setError(error.response.data.message || "Login failed");
    }
  };

  return (
    <>
      <div className="login-main">
        <div className="Login column-right">
          <div className="logo">
            <svg
              width="211"
              height="64"
              viewBox="0 0 211 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_1174_2)">
                <path
                  d="M30.8715 0C13.8222 0 0 13.9032 0 31.0525C0 48.2017 13.8222 62.105 30.8715 62.105C35.5866 62.105 40.0568 61.0409 44.0536 59.1384L35.883 50.9199C34.2797 51.3298 32.6003 51.5471 30.8715 51.5471C19.6178 51.5471 10.4963 42.3722 10.4963 31.0525C10.4963 19.7328 19.6178 10.5578 30.8715 10.5578C42.1252 10.5578 51.2467 19.7328 51.2467 31.0525C51.2467 34.4993 50.4008 37.7474 48.9046 40.596L56.5525 48.2887C59.831 43.3575 61.743 37.4307 61.743 31.0525C61.743 13.9032 47.9208 0 30.8715 0Z"
                  fill="#5C4AE4"
                />
                <path
                  d="M60.5396 58.7294L43.0762 41.1637L37.8372 46.4334L55.3005 63.9991L60.5396 58.7294Z"
                  fill="#5C4AE4"
                />
                <path
                  d="M40.5168 22.4592H44.2897L39.0457 41.5408H35.2462L30.9117 27.9495L26.5769 41.5408H22.7239L17.4531 22.4592H21.3594L24.8376 35.5928L29.0384 22.4592H32.8646L37.0917 35.6466L40.5168 22.4592Z"
                  fill="#333333"
                />
                <path
                  d="M103.659 16.3179H109.462L101.395 45.6724H95.5498L88.882 24.7639L82.2138 45.6724H76.2866L68.1777 16.3179H74.1874L79.5382 36.5225L86.0007 16.3179H91.8868L98.3904 36.6051L103.659 16.3179Z"
                  fill="#333333"
                />
                <path
                  d="M115.46 33.9553L120.441 33.21C121.593 33.0444 121.964 32.4648 121.964 31.7609C121.964 30.3118 120.852 29.1111 118.547 29.1111C116.16 29.1111 114.843 30.6428 114.678 32.4234L109.821 31.3883C110.15 28.2002 113.073 24.6812 118.506 24.6812C124.927 24.6812 127.314 28.3246 127.314 32.4234V42.4428C127.314 43.5191 127.438 44.9682 127.561 45.6722H122.54C122.416 45.134 122.334 44.0161 122.334 43.2294C121.305 44.8442 119.37 46.2519 116.366 46.2519C112.044 46.2519 109.409 43.3122 109.409 40.1242C109.41 36.4809 112.085 34.4523 115.46 33.9553ZM121.964 37.4332V36.5225L117.395 37.2262C115.996 37.4332 114.884 38.2198 114.884 39.7932C114.884 40.9939 115.749 42.1529 117.518 42.1529C119.823 42.1532 121.964 41.0353 121.964 37.4332Z"
                  fill="#333333"
                />
                <path
                  d="M134.547 15.2C136.44 15.2 137.922 16.7319 137.922 18.6365C137.922 20.4582 136.44 21.9902 134.547 21.9902C132.695 21.9902 131.172 20.4582 131.172 18.6365C131.172 16.7319 132.695 15.2 134.547 15.2ZM131.83 45.6724V25.3024H137.305V45.6724H131.83Z"
                  fill="#333333"
                />
                <path
                  d="M149.9 25.3022H153.975V30.1878H149.9V38.7167C149.9 40.497 150.723 41.0766 152.287 41.0766C152.946 41.0766 153.687 40.9938 153.975 40.9108V45.4652C153.481 45.6722 152.493 45.962 150.888 45.962C146.936 45.962 144.467 43.602 144.467 39.6687V30.1876H140.803V25.302H141.832C143.973 25.302 144.961 23.8943 144.961 22.0725V19.2157H149.9V25.3022V25.3022Z"
                  fill="#333333"
                />
                <path
                  d="M160.342 15.2C162.235 15.2 163.717 16.7319 163.717 18.6365C163.717 20.4582 162.235 21.9902 160.342 21.9902C158.49 21.9902 156.967 20.4582 156.967 18.6365C156.967 16.7319 158.49 15.2 160.342 15.2ZM157.625 45.6724V25.3024H163.1V45.6724H157.625Z"
                  fill="#333333"
                />
                <path
                  d="M173.419 45.6725H167.944V25.3024H173.254V27.8278C174.489 25.7165 176.917 24.764 179.099 24.764C184.121 24.764 186.426 28.3661 186.426 32.8376V45.6725H180.951V33.7899C180.951 31.5127 179.84 29.7324 177.206 29.7324C174.818 29.7324 173.419 31.5955 173.419 33.9553V45.6725Z"
                  fill="#333333"
                />
                <path
                  d="M195.482 45.4654C195.852 47.7012 197.622 49.316 200.215 49.316C203.673 49.316 205.607 47.5772 205.607 43.6439V42.1534C204.784 43.4783 202.891 44.7618 199.968 44.7618C194.576 44.7618 190.542 40.5803 190.542 34.8666C190.542 29.4842 194.412 24.93 199.968 24.93C203.179 24.93 205.031 26.3377 205.731 27.7038V25.3024H211V43.4783C211 49.0675 207.995 54.1601 200.38 54.1601C194.823 54.1601 191.119 50.6823 190.542 46.7906L195.482 45.4654ZM205.69 34.8664C205.69 31.7198 203.549 29.7324 200.915 29.7324C198.199 29.7324 196.058 31.7198 196.058 34.8664C196.058 38.0545 198.075 40.0418 200.915 40.0418C203.714 40.0418 205.69 38.0128 205.69 34.8664Z"
                  fill="#333333"
                />
              </g>
              <defs>
                <clipPath id="clip0_1174_2">
                  <rect width="211" height="64" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
          <h2 className="sub-tagline">Login Here</h2>
          <div className="seprator"></div>
          <form onSubmit={handleSubmit}>
            <input
              className="input-field"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              className="input-field"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <input
              className="submit-btn theme-background"
              type="submit"
              value="Submit"
            />
           
          </form>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default Login;
