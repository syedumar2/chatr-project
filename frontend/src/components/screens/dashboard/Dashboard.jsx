import { useContext, useEffect, useState } from "react";
import api from "@/utils/axios";
import { AuthContext } from "@/utils/AuthContext";

const Dashboard = () => {
  const { accessToken } = useContext(AuthContext);
  console.log("Access Token fetched on dashboard is",accessToken);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchProtectedData = async () => {
      try {
        const res = await api.get("/protected", {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
        });
        setUserData(res.data.data);
      } catch (err) {
        console.error(err.response?.data?.message || err.message);
      }
    };
    fetchProtectedData();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      {userData ? (
        <>
          <p>Fullname: {userData.fullname}</p>
          <p>Email: {userData.email}</p>
          <p>Message: {userData.message}</p>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Dashboard;
