import { useTranslation } from 'react-i18next';

export const useDisplayUsername = () => {
  const { t } = useTranslation();

  const displayUserName = (user) => {
    console.log(user)
    if (user.banned) {
      return t('users.banned');
    }
    return user.username;
  };

  return displayUserName;
};