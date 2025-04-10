'use client';
import { useEffect } from "react";
import styles from './Modal.module.css';

const Modal = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className={styles.closeBtn}>✖</button>
        {children}
      </div>
    </div>
  );
};

export default Modal;