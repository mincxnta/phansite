import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../../assets/chat/ChatInput.css';

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
    <form onSubmit={handleSubmit} className="input-container">
      <div className="image-preview">
        {imagePreview &&
          <div className="image-wrapper">
            <img
              src={imagePreview}
              alt="Preview"
              className="preview-image"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="remove-button"
            >
              ✕
            </button>
          </div>
        }
      </div>
      <div className="input-wrapper">
        <label htmlFor="image-upload" className="upload-button">
          📷
        </label>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="file-input"
        />
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t('chat.type')}
          className="text-input"
        />
        <button type="submit" className="send-button">
          {t('chat.send')}
        </button>
      </div>
    </form>
  );
};