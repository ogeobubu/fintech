import React from "react";
import { useSelector } from "react-redux";

export const Dashboard = () => {
  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
    </div>
  );
};

export const DashboardOne = () => {
  const auth = useSelector((state) => state.auth);
  const { user, isLogged } = auth;
  return (
    <div className="dashboard">
      <h1>Dashboard/My Wallet {user.name}</h1>
    </div>
  );
};

export const DashboardTwo = () => {
  return (
    <div className="dashboard">
      <h1>Dashboard/Bitcoin</h1>
    </div>
  );
};

export const DashboardThree = () => {
  return (
    <div className="dashboard">
      <h1>Dashboard/Gift Cards</h1>
    </div>
  );
};

export default Dashboard;
