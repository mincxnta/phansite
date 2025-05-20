import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { errorHandler } from '../../utils/errorHandler.js';
import { toast } from 'react-toastify';

export const ChatInput = ({ onSendMessage, isTargetBanned }) => {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file)

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null)
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      onSendMessage(message, image);
      setMessage('');
      setImage(null);
      setImagePreview(null)
    } catch (error) {
      toast.error(t(errorHandler(error)))
    }
  };

  return (
    <form onSubmit={handleSubmit} className="py-2.5 px-5 bg-black">
      <div className="flex mb-3">
        {imagePreview &&
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-[60px] h-[60px] object-cover"
            />
            <button
              type="button"
              disabled={isTargetBanned}
              onClick={handleRemoveImage}
              className="absolute -top-2 -right-2 bg-red-600 rounded-full w-4 h-4 text-xs transition-transform hover:scale-110"
            >
              ✕
            </button>
          </div>
        }
      </div>
      <div className="flex items-center gap-6 mb-3">
        <label htmlFor="image-upload" className="cursor-pointer">
          <img src="/assets/images/icons/clip.png" className="h-12 transition-transform hover:scale-110" />
        </label>
        <input
          id="image-upload"
          disabled={isTargetBanned}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        <input
          type="text"
          disabled={isTargetBanned}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={isTargetBanned ? t('error.banned.user') : t('chat.type')}
          className={`flex-1 p-2.5  text-black -skew-x-3 ${isTargetBanned ? 'bg-[#b5b5b5] cursor-not-allowed' : 'bg-white'}`}
        />
        <button type="submit" className="py-2.5 px-2 bg-white ">
          <img src="/assets/images/icons/send.png" className="h-6 transition-transform hover:scale-110" />
        </button>
      </div>
    </form>
  );
};