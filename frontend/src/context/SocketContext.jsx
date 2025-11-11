import React,{createContext, useContext, useState, useEffect, useCallback} from 'react';
import {io} from 'socket.io-client';
import NotificationToast from './NotificationToast.jsx';


const SocketContext=createContext();

export const useSocket=()=>{
    return useContext(SocketContext);
};


export const SocketProvider =({ children}) =>{
    const [socket,setSocket]=useState(null);
    const [unreadCount, setUnreadCount]=useState(0);
    const [toast,setToast]=useState(null);

    const fetchUnreadCount=useCallback(async()=>{
        const token=localStorage.getItem('token');
        if(!token) return;

        try{
            const response=await fetch('http://localhost:5001/api/notifications/unread-count',{
                headers:{'Authorization':`Bearer ${token}`}
            });
        if(response.ok){
            const data=await response.json();
            setUnreadCount(data.count);
        }
        }catch(err){
            console.error("Failed to fetch unread count:",err);
        }
    },[]);


    useEffect(()=>{
        const token=localStorage.getItem('token');
        if(!token){
            return;
        }

        const newSocket=io('http://localhost:5001',{
            auth:{token}
        });

        setSocket(newSocket);

        fetchUnreadCount();
        return ()=>newSocket.close();
    },[fetchUnreadCount]);


    useEffect(()=>{
        if(!socket) return;
        socket.on('receiveNotification',(notification)=>{
            console.log('Live notification received:',notification);
            setUnreadCount(prevCount => (prevCount ?? 0) + 1);
            setToast(notification.message);

        });

        return ()=>{
            socket.off('receiveNotification');
        };

    },[socket]);

    const value={
        socket,
        unreadCount,
        setUnreadCount,
        refetchUnreadCount:fetchUnreadCount
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
            <NotificationToast
            message={toast}
            onClose={()=>setToast(null)}
            />
        </SocketContext.Provider>
    );


    
};

