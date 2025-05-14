import React from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const ConfirmToast = ({ message, onConfirm, onCancel, closeToast }) => {
  const { t } = useTranslation();

  return (
    <div style={{ padding: '10px', textAlign: 'center' }}>
      <p>{message}</p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '10px' }}>
        <button
          onClick={() => {
            onConfirm();
            closeToast();
          }}
          style={{
            padding: '8px 16px',
            backgroundColor: '#AB0000',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          {t('yes')}
        </button>
        <button
          onClick={() => {
            onCancel();
            closeToast();
          }}
          style={{
            padding: '8px 16px',
            backgroundColor: '#666',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          {t('no')}
        </button>
      </div>
    </div>
  );
};

export const showConfirmToast = (message, onConfirm, onCancel) => {
  toast(
    ({ closeToast }) => (
      <ConfirmToast
        message={message}
        onConfirm={onConfirm}
        onCancel={onCancel}
        closeToast={closeToast}
      />
    ),
    {
      position: 'top-center',
      autoClose: false,
      closeOnClick: false,
      draggable: false,
      closeButton: true,
    }
  );
};