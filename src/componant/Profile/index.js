import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import validator from 'validator';

function Profile({ data, fetchData }) {

    let [fName, setFName] = useState(data.fname);
    let [lName, setLName] = useState(data.lname);
    let [email, setEmail] = useState(data.email);
    let [password, setPassword] = useState();
    let [profile, setProfile] = useState(data.photo);
    let [description, setDescription] = useState(data.description);
    let [error, setError] = useState();
    let [ballot, setBallot] = useState();
    let [recordUpdate, setRecordUpdate] = useState(false);
    let [isLoading, setIsLoading] = useState(false);

    let [oldPassword, setOldPassword] = useState();
    let [newPassword, setNewPassword] = useState();
    let [showPassword, setShowPassword] = useState(false);
    let [passMsg, setPassMsg] = useState();
    let [passUpdate, setPassUpdate] = useState(false);
    let [passCri, setPassCri] = useState(false);

    function handleUpdateTitle(e) {
        e.preventDefault();
        axios.put("http://localhost:8080/candidate/profile", {
            id: data._id,
            email: email,
            photo: profile,
            fname: fName,
            lname: lName,
            description: description
        }).then((data) => {
            fetchData();
            setRecordUpdate(true)
            console.log(data.data);
        })
            .catch(err => {
                console.log(err.response.data.error);
            })
    }

    function getBallot() {
        setIsLoading(false)
        axios.post("http://localhost:8080/ballot/getballot", {
            _id: data.ballot_id
        }).then((data) => {
            setBallot(data.data[0])
            setIsLoading(true)
        })
            .catch(err => {
                console.log(err.response.data.error);
            })
    }

    function covertToBase64(e) {
        setProfile('');
        var reader = new FileReader();
        if (e.target.files.length > 0) {
            setError('');
            if ((e.target.files[0].size / 1024) < 1024) {
                setError('');
                reader.readAsDataURL(e.target.files[0])
                reader.onload = () => {
                    // console.log(reader.result);
                    setProfile(reader.result);
                }
                reader.onerror = error => console.log("Error: ", error);
            } else {
                setError('Image is too large')
            }
        } else {
            setProfile('');
            setError('Please Select Image')
        }
    }

    function handleUpdatePassword(e) {
        e.preventDefault();
        if (data.password === oldPassword) {
            if (oldPassword !== newPassword) {
                if (passCri) {
                    axios.put("http://localhost:8080/candidate/password", {
                        id: data._id,
                        password: atob(newPassword)
                    }).then((data) => {
                        setError('');
                        setNewPassword('')
                        setOldPassword('')
                        setPassMsg('')
                        fetchData();
                        setPassUpdate(true);
                    })
                        .catch(err => {
                            console.log(err.response.data.error);
                        })
                } else {
                    setError('New Password is not Match with Password Criteria')
                }
            } else {
                setError('Old Password and New Password is same')
            }
        } else {
            console.log(newPassword)
            setError('Please Enter Correct Current Password')
        }
    }

    const validate = (value) => {

        if (validator.isStrongPassword(value, {
            minLength: 8, minLowercase: 1,
            minUppercase: 1, minNumbers: 1, minSymbols: 1,
        })) {
            setPassMsg('Is Strong Password');
            setPassCri(true);
        } else {
            setPassMsg('Is Not Strong Password');
            setPassCri(false);
        }
    }

    useEffect(() => {
        getBallot()
    }, [])

    return (
        <div className="page-wrapper">
            <div className="page-breadcrumb">
                <div className="container-fluid row">
                    <div className="col-12 d-flex no-block align-items-center">
                        <h4 className="page-title"><u><Link className="text-dark" to={'/'}>Dashboard</Link></u> {'>'} Manage Profile</h4>
                    </div>
                </div>
                <div className="container-fkuid">
                    <div className="row">
                        <div className="col-md-3"></div>
                        <div className="col-md-6">
                            <div className="card">
                                <form className="form-horizontal" method="post" onSubmit={handleUpdatePassword}>
                                    <div className="card-body">
                                        <h4 className="card-title">Reset Password</h4>
                                        <div className="form-group row">
                                            <div className="col-md-12">
                                                <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="form-control" id="cpassword" placeholder="Current Password" />
                                            </div>
                                        </div>

                                        <div className="form-group row mb-0">
                                            <div className="col-md-12">
                                                <input type="password" value={newPassword} onChange={(e) => { setNewPassword(e.target.value); validate(e.target.value) }} className="form-control" id="npassword" placeholder="New Password" />
                                            </div>
                                            <div className="col-md-12">
                                                <p className="m-0 mt-2" onClick={() => setShowPassword(showPassword = !showPassword)} style={{ color: '#6352ca', cursor: 'pointer' }}>{showPassword ? 'Hide' : 'Show'} password</p>
                                                {showPassword ? <span>{newPassword}</span> : ''} <br />
                                            </div>
                                            {passMsg === '' ? null :
                                                <p className="mt-1 mb-1" style={{
                                                    fontWeight: 'bold',
                                                }}>
                                                    {passMsg}
                                                </p>}
                                            <p className="m-0">NOTE: Password must contain following letters:
                                                <ul>
                                                    <li>one digit from 1 to 9</li>
                                                    <li>one lowercase letter</li>
                                                    <li>one uppercase letter</li>
                                                    <li>one special character</li>
                                                    <li>it must be 8-16 characters long.</li>
                                                </ul>
                                            </p>
                                            <span className="error">{error}</span>
                                            {passUpdate && (<div className="alert alert-success" role="alert">
                                                Password has been updated
                                            </div>)}

                                        </div>

                                    </div>
                                    <div className="border-top">
                                        <div className="card-body">
                                            <button type="submit" className="btn btn-primary">
                                                Update
                                            </button>

                                            <Link to={'/'}>
                                                <span style={{ marginLeft: '10px' }} className="btn btn-outline-success">
                                                    Back
                                                </span>
                                            </Link>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-3"></div>
                        {isLoading ? (<div className="col-md-6">
                            <div className="card">
                                <form className="form-horizontal" method='post' onSubmit={handleUpdateTitle}>
                                    <div className="card-body">
                                        <h4 className="card-title">Personal Info</h4>
                                        <div className="form-group row">
                                            <label htmlFor="fname" className="col-sm-3 text-end control-label col-form-label">First Name</label>
                                            <div className="col-sm-9">
                                                <input type="text" value={fName} onChange={(e) => setFName(e.target.value)} className="form-control" id="fname" placeholder="First Name Here" />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor="fname" className="col-sm-3 text-end control-label col-form-label">Last Name</label>
                                            <div className="col-sm-9">
                                                <input type="text" value={lName} onChange={(e) => setLName(e.target.value)} className="form-control" id="fname" placeholder="Last Name Here" />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor="email" className="col-sm-3 text-end control-label col-form-label">Email</label>
                                            <div className="col-sm-9">
                                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" id="email" placeholder="Last Name Here" />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor="disabledTextInput" className="col-sm-3 text-end control-label col-form-label">Ballot</label>
                                            <div className="col-sm-9">
                                                <input type="text" value={ballot.ballot_name} id="disabledTextInput" class="form-control" placeholder="Disabled input" disabled />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-3 text-end control-label col-form-label">Profile</label>
                                            <div className="col-md-9">
                                                <div className="custom-file">
                                                    <input type="file" accept="image/*" onChange={covertToBase64} className="custom-file-input" id="validatedCustomFile" />
                                                    <div className="invalid-feedback">
                                                        Example invalid custom file feedback
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {profile
                                            ? (<div className="row">
                                                <label className="col-sm-3 text-end">Profile Preview</label>
                                                <div className="col-md-9">
                                                    {<img src={profile} alt="Profile" width={100} height={100} />}&nbsp;&nbsp;&nbsp;
                                                    <span onClick={() => setProfile('')} className='error' style={{ cursor: 'pointer' }}>Remove Profile</span>
                                                </div>
                                            </div>)
                                            : <></>}

                                        <div className="form-group row mt-3">
                                            <label htmlFor="cono1" className="col-sm-3 text-end control-label col-form-label">Description</label>
                                            <div className="col-sm-9">
                                                <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="form-control" style={{ height: '42px' }} defaultValue={""} />
                                            </div>
                                        </div>

                                        <div className="row">
                                            <label className="col-sm-3"></label>
                                            <div className="col-md-9">
                                                <p className="m-0 error">{error}</p>
                                            </div>
                                        </div>
                                        {recordUpdate && (<div className="alert alert-success" role="alert">
                                            Record has been updated
                                        </div>)}
                                    </div>
                                    <div className="border-top">
                                        <div className="card-body">
                                            <button type="submit" className="btn btn-primary">
                                                Update
                                            </button>

                                            <Link to={'/'}>
                                                <span style={{ marginLeft: '10px' }} className="btn btn-outline-success">
                                                    Back
                                                </span>
                                            </Link>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>) : <>Loading...</>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
