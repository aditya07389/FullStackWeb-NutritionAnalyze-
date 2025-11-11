import React,{useState,useEffect} from 'react';
import {Link} from 'react-router-dom';
import {useSocket} from '../context/SocketContext';

const timeAgo=(date)=>{
    const seconds=Math.floor((new Date()-new Date(date))/1000);
    let interval=seconds/31536000;
    if(interval>1)   return Math.floor(interval)+"Years ago";
    interval=seconds/2592000;
    if(interval>1)  return Math.floor(interval)+"months ago";
    interval=seconds/86400;
    if(interval>1)  return Math.floor(interval)+"days ago";

    interval=seconds/3600;
    if(interval>1)  return Math.floor(interval)+"hours ago";

    interval=seconds/60;
    if(interval>1) return Math.floor(interval)+"minutes ago";

    if(seconds<10) return "just now";
    return Math.floor(seconds)+"seconds ago";
};

const NotificationPage=()=>{
    const [notifications,setNotifications]=useState([]);
    const [isLoading,setIsLoading]=useState(true);
    const {refetchUnreadCount}=useSocket();

    //function to fetch all notifications from the database
    const fetchNotifications=async()=>{
        setIsLoading(true);
        const token=localStorage.getItem("token");
        if(!token){
            setIsLoading(false);
            return;
        }
        try{
            const response=await fetch("/api/notifications",{
                headers:{"Authorization":`Bearer ${token}`},
            });
            if(!response.ok)  throw new Error("Failed to fetch notifications");
            const data=await response.json();
            setNotifications(data);
        } catch(error){
            console.error("Error fetching notifications:",error);
        }finally{
            setIsLoading(false);
        }
    };

    useEffect(()=>{
        fetchNotifications();
        if(refetchUnreadCount){
            refetchUnreadCount();
        }
    },[refetchUnreadCount]);


    const handleMarkAsRead=async(id)=>{
        const notification=notifications.find(n=>n.id==id);
        if(notification && notification.isRead)  return;

        const token=localStorage.getItem("token");
        try{
            const response=await fetch(`/api/notifications/${id}/read`,{
                method:'PATCH',
                headers:{"Authorization":`Bearer ${token}`},

            });
            if(!response.ok) throw new Error("Failed to mark as read");
            setNotifications(prev=>
                prev.map(n=>(n.id==id?{ ...n,isRead:true}:n))
            );
            refetchUnreadCount();
        }catch(error){
            console.error("Error marking as read:",error);
        }

    };

    const handleMarkAllAsRead=async()=>{
        const token=localStorage.getItem("token");
        try{
            const response=await fetch('/api/notifications/readall',{
                method:'PATCH',
                headers:{"Authorization":`Bearer ${token}` },
            });
            if(!response.ok) throw new Error("Failed to mark all as read");
            setNotifications(prev=>prev.map(n=>({ ...n,isRead:true})));
            refetchUnreadCount();
        }catch(error){
            console.error("Error marking all as read:",error);
        }
    };
    if (isLoading) {
        return <div style={styles.container}><p>Loading notifications...</p></div>;
      }
    
      return (
        <div style={styles.container}>
          <h1 style={styles.title}>Notifications</h1>
          
          <div style={styles.buttonContainer}>
            <button 
              style={styles.markAllButton} 
              onClick={handleMarkAllAsRead}
              disabled={notifications.every(n => n.isRead)} // Disable if all are read
            >
              Mark All as Read
            </button>
          </div>
    
          <div style={styles.card}>
            {notifications.length === 0 ? (
              <p style={styles.noNotifications}>You have no notifications.</p>
            ) : (
              <ul style={styles.list}>
                {notifications.map(n => (
                  <li key={n.id} style={n.isRead ? styles.itemRead : styles.itemUnread}>
                    
                    {/* The notification is a Link if 'n.link' exists */}
                    <Link 
                      to={n.link || '#'} 
                      style={styles.link}
                      // When a user clicks a link, mark it as read
                      onClick={(e) => {
                        if (n.link === '#') e.preventDefault(); // Don't navigate if no link
                        handleMarkAsRead(n.id);
                      }} 
                    >
                      <div style={styles.itemContent}>
                        {/* The blue dot for unread messages */}
                        <span style={styles.dot(n.isRead)}></span>
                        <div style={styles.messageContainer}>
                          <p style={styles.message}>{n.message}</p>
                          <small style={styles.time}>{timeAgo(n.createdAt)}</small>
                        </div>
                      </div>
                    </Link>
    
                    {/* Show "Mark as Read" button only if it's unread */}
                    {!n.isRead && (
                      <button 
                        style={styles.markButton} 
                        onClick={() => handleMarkAsRead(n.id)}
                      >
                        Mark as Read
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      );
    };
    
    // Inline styles, similar to your ProfilePage
    const styles = {
      container: {
        fontFamily: "Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#f9f9f9",
        minHeight: "100vh",
        padding: "30px",
      },
      title: {
        color: "#2c3e50",
        marginBottom: "20px",
      },
      buttonContainer: {
        width: "100%",
        maxWidth: "600px",
        display: "flex",
        justifyContent: "flex-end",
        marginBottom: "10px",
      },
      markAllButton: {
        backgroundColor: "transparent",
        color: "#3498db",
        border: "none",
        padding: "8px 12px",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "bold",
      },
      card: {
        backgroundColor: "white",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        width: "100%",
        maxWidth: "600px",
        overflow: "hidden", // To contain list items
      },
      noNotifications: {
        padding: "40px",
        textAlign: "center",
        color: "#777",
      },
      list: {
        listStyleType: "none",
        padding: 0,
        margin: 0,
      },
      itemUnread: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 20px",
        borderBottom: "1px solid #f0f0f0",
        backgroundColor: "#ffffff",
      },
      itemRead: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 20px",
        borderBottom: "1px solid #f0f0f0",
        backgroundColor: "#f5f5f5",
        color: "#888",
      },
      link: {
        textDecoration: 'none',
        color: 'inherit',
        flexGrow: 1,
      },
      itemContent: {
        display: 'flex',
        alignItems: 'center',
      },
      dot: (isRead) => ({
        width: "10px",
        height: "10px",
        borderRadius: "50%",
        backgroundColor: isRead ? "transparent" : "#3498db",
        marginRight: "15px",
        flexShrink: 0,
      }),
      messageContainer: {
        display: 'flex',
        flexDirection: 'column',
      },
      message: {
        margin: 0,
        fontWeight: "500",
      },
      time: {
        margin: 0,
        marginTop: '4px',
        fontSize: '12px',
        color: '#999',
      },
      markButton: {
        backgroundColor: "#2ecc71",
        color: "white",
        border: "none",
        padding: "5px 10px",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "12px",
        flexShrink: 0,
        marginLeft: "10px",
      }
}
export default NotificationPage;