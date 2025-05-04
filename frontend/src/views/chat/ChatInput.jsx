import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const ChatInput = ({ onSendMessage }) => {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file){
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
    onSendMessage(message, image);
    setMessage('');
    setImage(null);
    setImagePreview(null)
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
              onClick={handleRemoveImage}
              className="absolute -top-2 -right-2 bg-red-600 rounded-full w-4 h-4 text-xs"
            >
              ✕
            </button>
          </div>
        }
      </div>
      <div className="flex items-center gap-2.5 mb-3">
        <label htmlFor="image-upload" className="cursor-pointer">
          📷
        </label>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t('chat.type')}
          className="flex-1 p-2.5 bg-white text-black"
        />
        <button type="submit" className="py-2.5 px-5 bg-red-600 ">
          {t('chat.send')}
        </button>
      </div>
    </form>
  );
};