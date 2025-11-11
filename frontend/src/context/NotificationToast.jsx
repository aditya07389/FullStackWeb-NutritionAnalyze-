import React,{useState,useEffect} from 'react';

const NotificationToast=({message,onClose})=>{
    const [isVisible,setIsVisible]=useState(false);

    useEffect(()=>{
        if(message){
            setIsVisible(true);
            const timer=setTimeout(()=>{
                setIsVisible(false);
                onClose();
            },5000);
            return()=>clearTimeout(timer);

        }
    },[message,onClose]);

    if(!isVisible){
        return null;
    }
    return (
        <div style={styles.toastContainer}>
          <div style={styles.toastContent}>
            <strong>New Notification</strong>
            <p style={styles.message}>{message}</p>
          </div>
          <button style={styles.closeButton} onClick={() => setIsVisible(false)}>
            &times;
          </button>
        </div>
      );
    };
    
    const styles = {
      toastContainer: {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: '#333',
        color: 'white',
        padding: '15px 20px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '300px',
        fontFamily: 'Arial, sans-serif'
      },
      toastContent: {
        margin: 0,
      },
      message: {
        margin: '5px 0 0 0',
        fontSize: '14px',
        opacity: 0.9,
      },
      closeButton: {
        background: 'transparent',
        border: 'none',
        color: 'white',
        fontSize: '20px',
        cursor: 'pointer',
        padding: '0 0 0 10px',
        lineHeight: 1,
      }
    };
    
export default NotificationToast;

