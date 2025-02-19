import { useEffect, useState } from "react";
import validator from 'validator';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

function ResetPassword() {

    let [password, setPassword] = useState('');
    let [cnfPassword, setCnfPassword] = useState('');
    let [passError, setPassError] = useState('');
    let [passCri, setPassCri] = useState(false);
    let [isToken, setIsToken] = useState();
    let [isPassUpdate, setIsPassUpdate] = useState(false);
    const [errorMessage, setErrorMessage] = useState('')

    const queryParams = window.location.pathname;
    const token = queryParams.split('/')[2]
    const id = queryParams.split('/')[3]

    function handleReset(e) {
        e.preventDefault();
        if (password === cnfPassword) {
            setPassError('');
            if (passCri) {
                resetPassword()
            } else {
                setPassError('Please Enter Strong Password');
            }
        } else {
            setPassError('Your Password is not match');
        }
    }

    function resetPassword() {
        axios.put("http://localhost:8080/candidate/password", {
            "id": id,
            "password": btoa(password)
        }).then((data) => {
            removeToken()
        })
            .catch(err => console.log(err))
    }

    function removeToken() {
        axios.put("http://localhost:8080/token/removetoken", {
            "token": token
        }).then((data) => {
            setIsPassUpdate(true)
        })
            .catch(err => console.log(err))
    }

    function getToken() {
        axios.post("http://localhost:8080/token/gettoken", {
            "token": token
        }).then((data) => {
            setIsToken(data.data.status)
        })
            .catch(err => console.log(err))
    }

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

    useEffect(() => {
        getToken()
    }, [])

    return (
        <div className="main-wrapper bg-dark full-height div-center">
            <div className="auth-wrapper d-flex no-block justify-content-center align-items-center">
                <div className="auth-box border-secondary ">
                    <div id="loginform">
                        <div className="text-center pt-3 pb-3">
                            <span className="db"><img src="../../assets/images/logo-text.png" alt="logo" /></span>
                        </div>
                        {/* Form */}
                        {isToken ? (<form className="form-horizontal " onSubmit={handleReset}>
                            <div className="row pb-4">
                                <div className="col-12">
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
                                    {isPassUpdate ? (<div className="alert alert-success" role="alert">
                                        Password has been Updated
                                    </div>) : (<></>)}
                                </div>
                            </div>
                            <div className="row border-top border-secondary">
                                <div className="col-12">
                                    <div className="form-group">
                                        <div className="pt-3 d-grid">
                                            <button className="btn btn-block btn-lg btn-info" type="submit">
                                                Reset Password
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>) : (<div className="alert alert-danger" role="alert">
                            Your Link has been Expired
                        </div>)}

                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;
