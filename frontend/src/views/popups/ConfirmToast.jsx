import React from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const ConfirmToast = ({ message, onConfirm, onCancel, closeToast }) => {
  const { t } = useTranslation();

  return (
    <div className="text-xl">
      <p>{message}</p>
      <div className="flex gap-4 justify-center mt-2">
        <button
          onClick={() => {
            onConfirm();
            closeToast();
          }}
          className="text-white py-2 px-4 bg-black border-3 border-white button-hover"
        >
          {t('yes')}
        </button>
        <button
          onClick={() => {
            onCancel();
            closeToast();
          }}
          className="text-black py-2 px-4 bg-white border-3 border-black button-hover"
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