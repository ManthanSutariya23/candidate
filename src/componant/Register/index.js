import { useState } from "react";
import validator from 'validator';
import axios from 'axios'
import { useHistory, Navigate, Link } from 'react-router-dom';


function Register() {

    let [isAction, setIsAction] = useState(false);
    let [resend, setResend] = useState(false);
    let [company, setCompany] = useState('');
    let [email, setEmail] = useState('');
    let [password, setPassword] = useState('');
    let [cnfPassword, setCnfPassword] = useState('');
    let [elecdate, setElecdate] = useState();
    let [startTime, setStartTime] = useState();
    let [endTime, setEndTime] = useState();
    let [passCri, setPassCri] = useState(false);
    let [passError, setPassError] = useState('');
    let [otp, setOtp] = useState('');
    let [genotp, setGenotp] = useState();
    let [isDashboard, setIsDashboard] = useState(false);
    let [isCheckEmail, setIsCheckEmail] = useState(false);
    let [data, setData] = useState();

    const queryParams = window.location.pathname;
    const token = queryParams.split('/')[2]
    const clientId = queryParams.split('/')[3]
    const ballotId = queryParams.split('/')[4]

    function checkEmail(e) {
        e.preventDefault();
        axios.post("http://localhost:8080/client/checkemail", {
            "email": email,
        }).then((data) => { sendOTP(); })
            .catch(err => setPassError('Email is Already Exist !'))
    }

    function handlePostOTP() {
        let oottpp = Math.floor(100000 + Math.random() * 900000);
        setGenotp(oottpp);
        axios.post("http://localhost:8080/sendotp", {
            "email": email,
            "otp": oottpp
        })
            .catch(err => console.log(err))
    }

    function sendOTP() {
        if (endTime > startTime) {
            if (password === cnfPassword) {
                setPassError('');
                if (passCri) {
                    setIsDashboard(false);
                    handlePostOTP();
                    setIsAction(isAction = !isAction);
                    restartTimer();
                }
            } else {
                setPassError('Your Password is not match');
            }
        } else {
            setPassError('Election start time must be bigger then end time')
        }
    }

    const [seconds, setSeconds] = useState(20);
    let intervalId;

    function startTimer() {
        setSeconds(20);
        setResend(false);
        intervalId = setInterval(() => {
            setSeconds(prevSeconds => prevSeconds - 1);
        }, 1000);

        setTimeout(() => {
            clearInterval(intervalId);
            setSeconds(20);
            setResend(true);
        }, 20000); // 20 seconds in milliseconds
    };

    function restartTimer() {
        clearInterval(intervalId); // Clear the previous interval
        startTimer(); // Start the timer again
    };

    const [errorMessage, setErrorMessage] = useState('')

    const validate = (value) => {

        if (validator.isStrongPassword(value, {
            minLength: 8, minLowercase: 1,
            minUppercase: 1, minNumbers: 1, minSymbols: 1,
        })) {
            setErrorMessage('Is Strong Password');
            setPassCri(true);
        } else {
            setErrorMessage('Is Not Strong Password');
            setPassCri(false);
        }
    }

    function verifyOTP() {
        if (genotp === Number(otp)) {
            setResend(false);
            axios.post("http://localhost:8080/client", {
                "client_name": company,
                "title": "",
                "password": btoa(password),
                "email": email,
                "logo": "",
                "start_time": startTime,
                "end_time": endTime,
                "elec_date": elecdate,
                "address": "",
                "status": 1
            }).then((dataa) => {
                setData(dataa);
                sessionStorage.setItem('client_id', data.data._id);
                setIsDashboard(true);
            })
                .catch(err => console.log(err))
        }
    }

    return (
        <div className="main-wrapper bg-dark full-height div-center">
            <div className="auth-wrapper d-flex no-block justify-content-center align-items-center">
                <div className="auth-box bg-dark border-secondary">
                    <div>
                        <div className="text-center pt-3 pb-3">
                            <span className="db"><img src="/assets/images/logo-text.png" alt="logo" /></span>
                        </div>

                        {isAction ? (<>
                            <div className="row pb-4">
                                <div className="col-12">
                                    <p className="text-white fs-4 text-center">OTP will be Sent to your email</p>
                                    <div className="input-group mb-3">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text bg-success text-white h-100" id="basic-addon2"><i className="mdi mdi-cellphone-settings fs-4" /></span>
                                        </div>
                                        <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} className="form-control form-control-lg" placeholder="Enter OTP" aria-label="Password" aria-describedby="basic-addon1" required />
                                    </div>
                                    {resend
                                        ? (<p className="text-white fs-4 m-0 text-center" style={{ cursor: 'pointer' }} onClick={() => { restartTimer(); checkEmail(); }}>Resend Password</p>)
                                        : (<p className="text-white fs-4 text-center m-0">Resend OTP after 00:{seconds} Seconds</p>)
                                    }
                                </div>
                            </div>
                            <div className="row border-top border-secondary">
                                <div className="col-12">
                                    <div className="form-group">
                                        <div className="pt-3 d-grid">

                                            {isDashboard ?
                                                <>
                                                    <a className="btn btn-block btn-lg btn-info" href="/dashboard" >
                                                        Go to Dashboard
                                                    </a>
                                                </>
                                                : <>
                                                    <button className="btn btn-block btn-lg btn-info" onClick={() => verifyOTP()} >
                                                        Sign up
                                                    </button>
                                                    <br />
                                                    <button className="btn btn-block btn-lg btn-success text-white" type="button" onClick={() => { setIsAction(isAction = !isAction); clearInterval(intervalId); }} >
                                                        Back
                                                    </button>
                                                </>
                                            }

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>) : (<>
                            <form className="form-horizontal " onSubmit={checkEmail}>
                                <div className="row pb-4">
                                    <div className="col-12">
                                        <div className="input-group mb-3">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text bg-success text-white h-100" id="basic-addon1"><i className="mdi mdi-account fs-4" /></span>
                                            </div>
                                            <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} className="form-control form-control-lg" placeholder="Company Name" aria-label="Company name" aria-describedby="basic-addon1" required />
                                        </div>
                                        {/* email */}
                                        <div className="input-group mb-3">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text bg-danger text-white h-100" id="basic-addon1"><i className="mdi mdi-email fs-4" /></span>
                                            </div>
                                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control form-control-lg" placeholder="Email Address" aria-label="Email Address" aria-describedby="basic-addon1" required />
                                        </div>
                                        <span className="text-white fs-5">Election Date</span>
                                        <div className="input-group mb-3 mt-1">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text bg-warning text-white h-100" id="basic-addon1"><i className="mdi mdi-calendar-blank fs-4" /></span>
                                            </div>
                                            <input type="date" value={elecdate} onChange={(e) => setElecdate(e.target.value)} min={new Date().toISOString().split('T')[0]} className="form-control form-control-lg" placeholder="Election Date" aria-label="Date" aria-describedby="basic-addon1" required />
                                        </div>

                                        <div className="row">
                                            <div className="col-6">
                                                <span className="text-white fs-5">Election Start Time</span>

                                                <div className="input-group mb-3 mt-1">
                                                    <div className="input-group-prepend">
                                                        <span className="input-group-text bg-success text-white h-100" id="basic-addon1"><i className="mdi mdi-timer fs-4" /></span>
                                                    </div>
                                                    <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} min={`${new Date().getHours().toString().padStart(2, '0')}:${new Date().getMinutes().toString().padStart(2, '0')}`} className="form-control form-control-lg" placeholder="Start Time" aria-label="Start Time" aria-describedby="basic-addon1" required />
                                                </div>
                                            </div>

                                            <div className="col-6">
                                                <span className="text-white fs-5">Election End Time</span>
                                                <div className="input-group mb-3 mt-1">
                                                    <div className="input-group-prepend">
                                                        <span className="input-group-text bg-success text-white h-100" id="basic-addon1"><i className="mdi mdi-timer fs-4" /></span>
                                                    </div>
                                                    <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="form-control form-control-lg" placeholder="End Time" aria-label="End Time" aria-describedby="basic-addon1" required />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="input-group mb-3">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text bg-danger text-white h-100" id="basic-addon2"><i className="mdi mdi-lock fs-4" /></span>
                                            </div>
                                            <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); validate(e.target.value) }} className="form-control form-control-lg" placeholder="Password" aria-label="Password" aria-describedby="basic-addon1" required />
                                        </div>
                                        {errorMessage === '' ? null :
                                            <p className="text-center" style={{
                                                fontWeight: 'bold',
                                                color: 'white',
                                            }}>
                                                {errorMessage}
                                            </p>}
                                        <p className="text-white">NOTE: Password must contain following letters:
                                            <ul>
                                                <li>one digit from 1 to 9</li>
                                                <li>one lowercase letter</li>
                                                <li>one uppercase letter</li>
                                                <li>one special character</li>
                                                <li>it must be 8-16 characters long.</li>
                                            </ul>
                                        </p>
                                        <div className="input-group mb-3">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text bg-info text-white h-100" id="basic-addon2"><i className="mdi mdi-lock fs-4" /></span>
                                            </div>
                                            <input type="password" value={cnfPassword} onChange={(e) => { setCnfPassword(e.target.value); }} className="form-control form-control-lg" placeholder=" Confirm Password" aria-label="Password" aria-describedby="basic-addon1" required />
                                        </div>
                                        <p className="m-0 text-white">{passError}</p>
                                    </div>
                                </div>
                                <div className="row border-top border-secondary">
                                    <div className="col-12">
                                        <div className="form-group">
                                            <div className="pt-3 d-grid">
                                                <button className="btn btn-block btn-lg btn-info" type="submit">
                                                    Next
                                                </button>
                                                <br />
                                                <Link to={"/"}>
                                                    <span span className="d-flex justify-content-center btn btn-block btn-lg btn-success text-white" type="submit">
                                                        Login
                                                    </span>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </>)}
                    </div>
                </div>
            </div>
        </div >
    );
}

export default Register;
