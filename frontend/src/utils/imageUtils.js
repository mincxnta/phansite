import { API_URL } from '../constants/constants.js';

export const convertImageToBase64 = async (imageUrl) => {
  if (!imageUrl) return null;

  try {
    const response = await fetch(`${API_URL}${imageUrl}`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch image');
    }

    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      
    });
  } catch (error) {
    console.error('Error converting image to Base64:', error);
    return null;
  }
};