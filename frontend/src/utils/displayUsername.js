import { useTranslation } from 'react-i18next';

/**
 * Hook para mostrar el nombre de usuario teniendo en cuenta el estado de baneado.
 * 
 * Si el usuario está baneado, devuelve un texto localizado que indica que está baneado.
 * En caso contrario, devuelve el nombre de usuario.
 */
export const useDisplayUsername = () => {
  const { t } = useTranslation();

  const displayUserName = (user) => {
    if (user.banned) {
      return t('users.banned');
    }
    return user.username;
  };

  return displayUserName;
};