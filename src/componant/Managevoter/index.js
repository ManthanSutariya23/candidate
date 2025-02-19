import { useEffect, useState, useMemo } from "react";
import DataTable from "react-data-table-component";
import axios from 'axios';
import { Link } from 'react-router-dom'


function Managevoter() {

    const [voterData, setVoterData] = useState([]);
    const [loading, setLoading] = useState();
    // const createUsers = (numUsers = voterData.length) => new Array(numUsers).fill(undefined).map(voterData);
    // const voters = createUsers(voterData.length);

    const columns = [
        {
            name: 'First Name',
            selector: row => row.fname,
            sortable: true,
        },
        {
            name: 'Last Name',
            selector: row => row.lname,
            sortable: true,
        },
        {
            name: 'Email',
            selector: row => row.email,
            sortable: true,
        },
        {
            name: 'Address',
            selector: row => row.address,
            sortable: true,
        },
        {
            name: 'Postcode',
            selector: row => row.postcode,
            sortable: true,
        },
    ];

    useEffect(() => {
        fetchTableData();
    }, []);

    async function fetchTableData() {
        setLoading(true);
        axios.post("http://localhost:8080/voter/getvoter", {
            client_id: localStorage.getItem('clid'),
        }).then((data) => {
            setVoterData(data.data)
            console.log(data.data);
            setLoading(false);

        })
            .catch(err => {
                console.log(err)
                // setError(err.response.data.error);
            })
    }

    const [filterText, setFilterText] = useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
    const filteredItems = voterData.filter(item => (item.fname && item.fname.toLowerCase().includes(filterText.toLowerCase())) || (item.address && item.address.toLowerCase().includes(filterText.toLowerCase())) || (item.lname && item.lname.toLowerCase().includes(filterText.toLowerCase())) || (item.postcode && item.postcode.toLowerCase().includes(filterText.toLowerCase())));
    const subHeaderComponentMemo = useMemo(() => {
        const handleClear = () => {
            if (filterText) {
                setResetPaginationToggle(!resetPaginationToggle);
                setFilterText('');
            }
        };
        // return <FilterComponent onFilter={(e) => setFilterText(e.target.value)} onClear={() => handleClear()} filterText={filterText} />;
        return <>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-8">
                        <h3 className="text-start text-dark p-4 m-0"><Link to={'/'}><u className="text-dark" style={{}}>Dashboard</u></Link> {'>'} Voters</h3>
                    </div>
                    <div className="col-4 d-flex p-4">
                        <input type="text" data-toggle="tooltip" title="" value={filterText}
                            onChange={(e) => setFilterText(e.target.value)} class="form-control" id="search" placeholder="Filter By First Name, Last Name, Address, Postcode" required="" data-bs-original-title="A Tooltip for the input !" aria-label="Search Input" aria-describedby="tooltip912165" />
                        &nbsp;&nbsp;
                        <button type="button" className="btn btn-primary" onClick={() => handleClear()}>
                            Clear
                        </button>
                    </div>
                </div>
            </div>
        </>
    }, [filterText, resetPaginationToggle]);

    const tableStyle = {
        header: {
            style: {
                minHeight: '56px',
                textAlign: 'center'
            },
        },
        headRow: {
            style: {
                borderTopStyle: 'solid',
                borderTopWidth: '1px',
                borderTopColor: 'lightgrey',
                fontSize: '17px',
                textAlign: 'center'
            },
        },
        headCells: {
            style: {
                '&:not(:last-of-type)': {
                    borderRightStyle: 'solid',
                    borderRightWidth: '1px',
                    borderRightColor: 'lightgrey',
                    fontSize: '17px',
                    textAlign: 'center'
                },
            },
        },
        cells: {
            style: {
                '&:not(:first-of-type)': {
                    borderRightStyle: 'solid',
                    borderRightWidth: '1px',
                    borderRightColor: 'lightgrey',
                    fontSize: '17px',
                    textAlign: 'center'
                },
            },
        },
    };

    return (

        <div className="page-wrapper">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">

                        <div className="card">
                            <DataTable
                                //title="Data"
                                columns={columns}
                                data={filteredItems}
                                style={{ fontSize: "30px" }}
                                progressPending={loading}
                                highlightOnHover
                                pointerOnHover
                                pagination
                                paginationResetDefaultPage={resetPaginationToggle}
                                // fixedHeader={true}
                                // fixedHeaderScrollHeight={'74vh'}
                                subHeaderComponent={subHeaderComponentMemo}
                                subHeader
                                customStyles={tableStyle}
                                expandableRows={true}
                                expandableRowsComponent={(data) =>
                                    <VoterDisplay data={data.data} />
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function VoterDisplay({ data }) {
    return <div className="container-fluid py-5 h-100" style={{ backgroundColor: '#9de2ff' }}>
        <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col col-md-9 col-lg-7 col-xl-4">
                <div className="card" style={{ borderRadius: '15px' }}>
                    <div className="card-body p-4">
                        <div className="d-flex text-black">
                            <div className="flex-shrink-0">
                                <img src={data.photo} alt="Profile" className="img-fluid" style={{ width: '180px', height: '180px', borderRadius: '10px' }} />
                            </div>
                            <div className="flex-grow-1 ms-3">
                                <h5 className="mb-1">{data.fname} {data.lname}</h5>
                                <p className="mb-2 pb-1" style={{ color: '#2b2a2a', borderRadius: '10px' }}>{data.email}</p>
                                <div className="p-2 mb-2" style={{ backgroundColor: '#efefef' }}>
                                    <p className="mb-2">Address: {data.address}, {data.postcode}</p>
                                    <p className="m-0">Gender: {data.gender}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>;
}

export default Managevoter;
