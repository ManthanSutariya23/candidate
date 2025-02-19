import { Link } from "react-router-dom";
import { useState } from "react";
import axios from 'axios';
import sendemail from '../Comman/sendemail'

function Login() {

    let [email, setEmail] = useState('');
    let [resetEmail, setResetEmail] = useState('');

    let [password, setPassword] = useState('');
    let [isError, setIsError] = useState(false);
    let [isSend, setIsSend] = useState(false);
    let [error, setError] = useState('');

    function login(e) {
        e.preventDefault();
        axios.post("http://localhost:8080/candidate/login", {
            "email": email,
            "password": btoa(password)
        }).then((data) => {
            setIsError(false);
            console.log(data)
            localStorage.setItem("id", data.data._id);
            localStorage.setItem("clid", data.data.client_id);
            localStorage.setItem("balid", data.data.ballot_id);
            window.location.href = "/";
        })
            .catch(err => setIsError(true))
    }

    function handleReset(e) {
        e.preventDefault();
        console.log(resetEmail)
        axios.post("http://localhost:8080/candidate/login", {
            "email": resetEmail
        }).then((data) => {
            console.log(data)
            createToken(data.data._id)
        })
            .catch(err => setError('Email is not Exist'))
    }

    function createToken(id) {
        setIsSend(false);
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let token = '';
        for (let i = 0; i < 18; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            token += charset[randomIndex];
        }
        axios.post("http://localhost:8080/token", {
            "token": token,
            "status": true
        }).then((data) => {
            sendEmail(token, id)
            setIsError(false);
            setError('')
            setIsSend(true)
        }).catch(err => console.log(err))
    }

    function sendEmail(token, id) {
        const message = ''
        const receiverEmail = resetEmail
        const subject = 'Reset Password from E-Vote Hub'
        const html = `<a href="http://localhost:3001/resetpassword/${token}/${id}">CLick Here<a/> to reset your password <br/> <br/>Thank you`
        sendemail(message, receiverEmail, subject, html)
    }

    return (
        <div className="main-wrapper bg-dark full-height div-center">
            <div className="auth-wrapper d-flex no-block justify-content-center align-items-center">
                <div className="auth-box border-secondary ">
                    <div id="loginform">
                        <div className="text-center pt-3 pb-3">
                            <span className="db"><img src="../assets/images/logo-text.png" alt="logo" /></span>
                        </div>
                        {/* Form */}
                        <form className="form-horizontal mt-3" id="loginform" onSubmit={login}>
                            <div className="row pb-4">
                                <div className="col-2"></div>
                                <div className="col-8">
                                    <div className="input-group mb-3">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text bg-success text-white h-100" id="basic-addon1"><i className="mdi mdi-email fs-4" /></span>
                                        </div>
                                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control form-control-lg" placeholder="Email" aria-label="Email" aria-describedby="basic-addon1" required />
                                    </div>
                                    <div className="input-group mb-3">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text bg-warning text-white h-100" id="basic-addon2"><i className="mdi mdi-lock fs-4" /></span>
                                        </div>
                                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control form-control-lg" placeholder="Password" aria-label="Password" aria-describedby="basic-addon1" required />
                                    </div>
                                    {isError ? <p className="text-white text-center">Email id and password is incorrect</p> : <></>}
                                    <div className="border-top border-secondary">
                                        <div className="">
                                            <div className="form-group">
                                                <div className="pt-3">
                                                    <button className="form-control form-control-lg btn btn-success text-white" type="submit">
                                                        Login
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-2"></div>

                            </div>
                        </form>
                    </div>
                    <div id="recoverform">
                        <div className="text-center">
                            <span className="text-white">Enter your e-mail address below and we will send you instructions how to recover a password.</span>
                        </div>
                        <div className="row mt-3">
                            {/* Form */}
                            <div className="col-2"></div>

                            <form className="col-8" action="post" onSubmit={handleReset}>
                                {/* email */}
                                <div className="input-group mb-3">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text bg-danger text-white h-100" id="basic-addon1"><i className="mdi mdi-email fs-4" /></span>
                                    </div>
                                    <input type="email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} className="form-control form-control-lg" placeholder="Email Address" aria-label="Username" aria-describedby="basic-addon1" required />
                                    <button className="btn btn-info float-end" type="submit" name="action">
                                        Send Mail
                                    </button>
                                </div>
                                {/* pwd */}
                                {error ? (<div className="alert alert-danger" role="alert">
                                    {error}
                                </div>) : (<></>)}
                                {isSend ? (<div className="alert alert-success" role="alert">
                                    Reset password link has been sent to your email
                                </div>) : (<></>)}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
