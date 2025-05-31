import { useContext, useEffect, useState } from "react";
import api from "@/utils/axios";
import  AuthContext from "@/utils/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const { accessToken, fetchUserData, logout } = useContext(AuthContext);

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const getData = async () => {
      const res = await fetchUserData();

      if (res.success) {
        setUserData(res.userData);
      }
      else{
         console.error(res.message);
      }
    };
    getData();
  }, [fetchUserData]);

  const logOut = async () => {
    const res = await logout();
    if (res.success) {
      setUserData(null);
      console.log(res.message);
      navigate("/signin");
    } else {
      alert(res.message);
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      {userData ? (
        <>
          <p>Fullname: {userData.fullname}</p>
          <p>Email: {userData.email}</p>
         
          <Button className="outline" onClick={logOut}>
            Logout
          </Button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Dashboard;
