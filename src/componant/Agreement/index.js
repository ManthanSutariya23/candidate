import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Agreement({ data }) {

    return (
        <div className="page-wrapper">
            <div className="page-breadcrumb">
                <div className="container-fluid row">
                    <div className="col-12 d-flex no-block align-items-center">
                        <h4 className="page-title"><u><Link className="text-dark" to={'/'}>Dashboard</Link></u> {'>'} Agreement</h4>
                    </div>
                </div>

                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-2"></div>
                        <div className="col-md-8">
                            <div className="card p-3">
                                {data.agreement}
                                <br />
                                <br />
                                <br />
                                <Link to={'/'}>
                                    <span className="btn btn-outline-success">
                                        Back
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-2"></div>
                        <div className="col-md-8">

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Agreement;