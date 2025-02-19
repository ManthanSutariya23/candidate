import { useEffect, useState } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";

function Dashboard({ data, candidatedata }) {

    let [isLoding, setIsLoding] = useState(true);
    let [totalVoter, setTotalVoter] = useState();
    let [totalBallot, setTotalBallot] = useState();
    let [ballotName, setBallotName] = useState();

    useEffect(() => {
        getVoter();
    }, []);

    async function getVoter() {
        setIsLoding(true);
        axios.post("http://localhost:8080/voter/getvoter", {
            client_id: localStorage.getItem('clid'),
        }).then((data) => {
            setTotalVoter(data.data.length)
            getBallot()
        })
            .catch(err => {
                console.log(err)
                // setError(err.response.data.error);
            })
    }

    function getBallot() {
        setIsLoding(true);
        axios.post("http://localhost:8080/ballot/getballot", {
            "client_id": localStorage.getItem('clid'),
        }).then((data) => {
            setTotalBallot(data.data.length);
            data.data.forEach(element => {
                if (element._id === candidatedata.ballot_id) {
                    setBallotName(element.ballot_name)
                }
            });
            setIsLoding(false)
        }).catch(err => console.log())
    }

    return (
        <div className="page-wrapper">
            <div className="page-breadcrumb">
                <div className="row">
                    <div className="col-12 d-flex no-block align-items-center">
                        <h4 className="page-title">Dashboard</h4>
                    </div>
                </div>
                {candidatedata.status
                    ? <></>
                    : <div className="alert alert-danger mt-3 mb-0" role="alert">
                        <h4 className="alert-heading">Sorry, You are no longer candidate of {ballotName}</h4>
                        <p>
                            Your Election commission denied you as a candidate of {ballotName}. So you have to ask your election commission about that. Detail is mentioned at the end of the page.
                        </p>
                        <hr />
                    </div>
                }
            </div>
            {isLoding ? (<h4 className="text-center pb-3">Loading...</h4>) : (<div className="container-fluid">
                <div className="row">
                    <div className="col-md-9">
                        <div class="row">
                            <div class="col-12">
                                <div class="card">
                                    <div class="card-body">
                                        <h3 class="card-title">URL</h3>
                                        <div className="border-top pt-3">
                                            <h4>Voter Registration Link</h4>
                                        </div>
                                        <div class="bg-light p-2" style={{ fontSize: '20px' }}>
                                            http://localhost:3002/register/{data._id}
                                        </div>

                                        <div className="pt-3">
                                            <h4>Election URL</h4>
                                        </div>
                                        <div class="bg-light p-2" style={{ fontSize: '20px' }}>
                                            http://localhost:3002/
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-12">
                                <div class="card">
                                    <div class="card-body">
                                        <h3 class="card-title">Election Day</h3>

                                        <div className="row border-top">
                                            <div className="col-md-6 col-12">
                                                <div className=" pt-3">
                                                    <h4>Start Date</h4>
                                                </div>
                                                <div class="bg-light p-2" style={{ fontSize: '20px' }}>
                                                    {new Date(data.start_time).toString()}
                                                </div>
                                            </div>

                                            <div className="col-md-6 col-12">
                                                <div className=" pt-3">
                                                    <h4>End Date</h4>
                                                </div>
                                                <div class="bg-light p-2" style={{ fontSize: '20px' }}>
                                                    {new Date(data.end_time).toString()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-12">
                                <div class="card">
                                    <div class="card-body">
                                        <h3 class="card-title">Election Detail</h3>

                                        <div className="row border-top">
                                            <div className="col-md-12 col-12 pt-2">
                                                <div className="form-group row">
                                                    <label className="col-sm-2 fs-4">Company Name</label>
                                                    <label className="col-sm-9 fs-4">
                                                        {data.client_name}
                                                    </label>
                                                </div>

                                                <div className="form-group row">
                                                    <label className="col-sm-2 fs-4">Title</label>
                                                    <label className="col-sm-9 fs-4">
                                                        {data.title}
                                                    </label>
                                                </div>

                                                <div className="form-group row">
                                                    <label className="col-sm-2 fs-4">Email of Company</label>
                                                    <label className="col-sm-9 fs-4">
                                                        {data.email}
                                                    </label>
                                                </div>

                                                <div className="form-group row">
                                                    <label className="col-sm-2 fs-4">Your Ballot is</label>
                                                    <label className="col-sm-9 fs-4">
                                                        {ballotName}
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3 col-lg-3 col-xlg-3">

                        <Link to={'/voter'}>
                            <div className="card card-hover" style={{ cursor: 'pointer' }}>
                                <div className="box bg-cyan p-4 text-center">
                                    <div className="d-flex justify-content-center align-items-center">
                                        <h1 className="font-light text-white m-0">
                                            <i className="mdi mdi-account-multiple" />
                                        </h1>
                                        <h3 className="text-white m-0">&nbsp; {totalVoter} Total Voter</h3>
                                    </div>
                                    <p className="text-white m-0">Tap to see voter List</p>
                                </div>
                            </div>
                        </Link>

                        <Link to={'/ballot'}>

                            <div className="card card-hover" style={{ cursor: 'pointer' }}>
                                <div className="box bg-info p-4 text-center">
                                    <div className="d-flex justify-content-center align-items-center">
                                        <h1 className="font-light text-white m-0">
                                            <i className="mdi mdi-account-card-details" />
                                        </h1>
                                        <h3 className="text-white m-0">&nbsp; {totalBallot} Total Ballot</h3>
                                    </div>
                                    <p className="text-white m-0">Tap to see ballot list</p>
                                </div>
                            </div>
                        </Link>

                        <Link to={'/profile'}>

                            <div className="card card-hover" style={{ cursor: 'pointer' }}>
                                <div className="box bg-success p-4 text-center">
                                    <div className="d-flex justify-content-center align-items-center">
                                        <h1 className="font-light text-white m-0">
                                            <i className="mdi mdi-account" />
                                        </h1>
                                        <h3 className="text-white m-0">&nbsp;Profile</h3>
                                    </div>
                                    <p className="text-white m-0">Tap to chnage profile</p>
                                </div>
                            </div>
                        </Link>

                        <Link to={'/result'}>

                            <div className="card card-hover" style={{ cursor: 'pointer' }}>
                                <div className="box bg-primary p-4 text-center">
                                    <div className="d-flex justify-content-center align-items-center">
                                        <h1 className="font-light text-white m-0">
                                            <i className="mdi mdi-certificate" />
                                        </h1>
                                        <h3 className="text-white m-0">&nbsp;Result</h3>
                                    </div>
                                    <p className="text-white m-0">Tap to chnage profile</p>
                                </div>
                            </div>
                        </Link>

                        <Link to={'/agreement'}>
                            <div className="card card-hover" style={{ cursor: 'pointer' }}>
                                <div className="box bg-danger p-4 text-center">
                                    <div className="d-flex justify-content-center align-items-center">
                                        <h1 className="font-light text-white m-0">
                                            <i className="mdi mdi-library-books" />
                                        </h1>
                                        <h3 className="text-white m-0">&nbsp;Agreement</h3>
                                    </div>
                                    <p className="text-white m-0">Tap to view agreement</p>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div >
            </div >)
            }
        </div >
    );
}

export default Dashboard;
