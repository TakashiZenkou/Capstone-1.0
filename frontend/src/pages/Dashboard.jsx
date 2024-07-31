import React from 'react';
import Sidebar from '../components/Sidebar';
import { useParams } from 'react-router-dom';

const Dashboard = () => {
  const { roomId } = useParams();
  return (
    <div>
       <Sidebar roomId={roomId} />
    </div>
  );
}

export default Dashboard ;