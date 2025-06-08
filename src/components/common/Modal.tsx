import React, { useEffect, useRef } from 'react';
import { FiX } from 'react-icons/fi';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const modalContentRef = useRef<HTMLDivElement>(null);

  // Close modal on escape key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // Add/remove 'show' class for CSS transitions
  useEffect(() => {
    if (modalContentRef.current) {
      if (isOpen) {
        // Delay adding 'show' class to allow 'animate-fadeIn' on overlay to start
        // and trigger the scale/opacity transition on content
        setTimeout(() => modalContentRef.current?.classList.add('show'), 10);
      } else {
        modalContentRef.current.classList.remove('show');
      }
    }
  }, [isOpen]);


  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div ref={modalContentRef} className="modal-content">
        <div className="flex justify-between items-center border-b border-neutral-200 pb-4 mb-6">
          <h2 className="text-2xl font-bold text-neutral-800">{title}</h2>
          <button onClick={onClose} className="text-neutral-500 hover:text-neutral-700 transition-colors">
            <FiX size={24} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;