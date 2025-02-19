import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from "react-router-dom";
import Dashboard from './componant/Dashboard';
import Login from './componant/Login';
import Register from './componant/Register';
import Profile from './componant/Profile';
import Footer from './componant/Footer';
import Menu from './componant/Menu';
import Managevoter from './componant/Managevoter';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ResetPassword from './componant/ResetPassword';
import Agreement from './componant/Agreement';
import Ballot from './componant/Manageballot';
import Result from './componant/Result';

function App() {

  const [login, setLogin] = useState(false);
  const [clientData, setClientData] = useState();
  const [candidateData, setCandidateData] = useState();

  const loginCheck = () => {
    const userId = localStorage.getItem("id");
    try {
      // api call
      if (userId) {
        fetchData();
      }
    } catch (error) {

    }
  }

  function fetchData() {
    const userId = localStorage.getItem("id");

    axios.post("http://localhost:8080/candidate/login", {
      '_id': userId
    }).then((data) => {
      setLogin(true);
      setCandidateData(data.data)
      fetchClientData(data.data.client_id)
      console.log(data.status);
    })
      .catch(err => console.log(err))
  }

  function fetchClientData(clientId) {

    axios.post("http://localhost:8080/client/getdetail", {
      'id': clientId
    }).then((data) => {
      setLogin(true);
      setClientData(data.data)
      console.log(data.status);
    })
      .catch(err => console.log(err))
  }

  useEffect(() => {
    loginCheck()
  }, [])

  return (
    login && clientData ?
      <>
        <Router>
          <div id="main-wrapper" data-layout="vertical" data-navbarbg="skin5" data-sidebar-position="absolute" data-header-position="absolute" data-boxed-layout="full">
            <Menu />

            <Routes>
              <Route path="/" element={<Dashboard data={clientData} candidatedata={candidateData} />} />
              <Route path="/profile" element={<Profile data={candidateData} fetchData={fetchData} />} />
              <Route path="/voter" element={<Managevoter />} />
              <Route path="/result" element={<Result />} />
              <Route path="/ballot" element={<Ballot />} />
              <Route path="/agreement" element={<Agreement data={clientData} />} />
              <Route path="/*" element={<Navigate from="/*" to={'/'} />} />
            </Routes>
            <Footer />
          </div>
        </Router>
      </>
      :
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/*" element={<Navigate from="/*" to={'/'} />} />
          <Route path="/register/:token/:clientid/:ballotid" element={<Register />} />
          <Route path="/resetpassword/:token/:id/" element={<ResetPassword />} />
        </Routes>
      </Router>
  );
}

export default App;
