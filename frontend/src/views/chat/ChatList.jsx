import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { API_URL } from '../../constants/constants.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { errorHandler } from '../../utils/errorHandler.js';
import { formatDistanceToNow } from 'date-fns';
import { locales } from '../../utils/dateLocales.js';
import { toast } from 'react-toastify';
import { Loading } from '../../components/Loading.jsx'
import { useDisplayUsername } from '../../utils/displayUsername.js';

export const ChatList = () => {
  const { user, onlineUsers, socket } = useAuth();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const displayUsername = useDisplayUsername();

  useEffect(() => {
    const fetchContacts = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/messages/users`, {
          method: 'GET',
          credentials: 'include',
        });

        const data = await response.json()
        if (!response.ok) {
          toast.error(t(errorHandler(data)))
        }

        const sortedUsers = data.sort((a, b) => {
          return new Date(b.lastMessage.date) - new Date(a.lastMessage.date);
        });
        setContacts(sortedUsers);

      } catch (error) {
        toast.error(t(errorHandler(error)))
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    };

    fetchContacts();
  }, [user, navigate]);

  useEffect(() => {
    if (!socket || !user) return;

    socket.on('newMessage', async (newMessage) => {
      if (newMessage.receiverId !== user.id) return;

      setContacts((prevContacts) => {
        const existingContact = prevContacts.find(
          (contact) => contact.id === newMessage.senderId
        );

        if (existingContact) {
          return prevContacts
            .map((contact) =>
              contact.id === newMessage.senderId
                ? {
                  ...contact,
                  lastMessage: {
                    message: newMessage.message || (newMessage.image ? `[${t('image')}]` : ''),
                    date: newMessage.date,
                  },
                }
                : contact
            )
            .sort((a, b) => {
              return new Date(b.lastMessage.date) - new Date(a.lastMessage.date);
            })
        } else {
          const newContact = {
            id: newMessage.senderId,
            username: newMessage.sender.username,
            profilePicture: newMessage.sender.profilePicture,
            lastMessage: {
              message: newMessage.message || (newMessage.image ? `[${t('image')}]` : ''),
              date: newMessage.date,
            },
          };
          const updatedContacts = [...prevContacts, newContact];
          return updatedContacts.sort((a, b) => {
            return new Date(b.lastMessage.date) - new Date(a.lastMessage.date);
          });
        }
      });
    });

    return () => {
      socket.off('newMessage');
    };
  }, [socket, user]);

  const handleContactClick = (username) => {
    navigate(`/chat/${username}`);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="container mx-auto p-4 pt-20">
        {contacts.length === 0 ? (
          <p className="text-white">{t('chat.empty.chat')}</p>
        ) : (
          <div className="flex justify-center">
            <ul className="w-full max-w-[600px]">
              {contacts.map((contact) => {
                const isUserSender = contact.lastMessage?.senderId === user.id;
                const messageText = contact.lastMessage.image
                  ? `[${t('image')}]`
                  : contact.lastMessage.message || t('chat.empty.message');
                const displayText = isUserSender ? `${t("chat.you")}: ${messageText}` : messageText;
                return (
                  <li
                    key={contact.id}
                    onClick={() => handleContactClick(contact.username)}
                    className="mb-6"
                  >
                    <div className="relative w-full transition-transform hover:scale-110">
                      <div className="absolute -top-4 left-0 z-10">
                        <div className="w-[8em] h-[8em] bg-white outline-6 outline-black border-6 border-white transform -skew-x-6">
                          <img
                            src={
                              contact.profilePicture && !contact.banned
                                ? contact.profilePicture
                                : '/assets/images/unknownTarget.png'
                            }
                            alt={displayUsername(contact)}
                            className="w-full h-full object-cover"
                          />
                          {onlineUsers.includes(contact.id) && (
                            <span className="online-indicator absolute -right-3.5 -bottom-3.5 w-4 h-4 bg-green-500 rounded-full border-2 border-persona-dark-red"></span>
                          )}
                        </div>
                      </div>
                      <div className="absolute left-32 top-[-1.5em] z-20">
                        <span className="font-earwig text-2xl sm:text-4xl w-fit text-white text-border">
                          {displayUsername(contact)}
                        </span>
                      </div>
                      <div className="ml-[7rem] mt-[3rem] relative">
                        <div
                          className="px-8 py-3 transform -skew-x-6 bg-black border-2"
                        >
                          <div className="skew-x-6 p-[0.75rem] break-words">
                            <p className="text-lg sm:text-2xl font-semibold text-white text-left overflow-hidden text-ellipsis whitespace-nowrap">
                              {displayText}
                            </p>
                          </div>
                        </div>
                      </div>
                      {contact.lastMessage?.date && (
                        <p className="text-white ml-[6rem] mt-2 text-right text-xs">
                          {formatDistanceToNow(new Date(contact.lastMessage.date), {
                            addSuffix: true,
                            locale: locales[i18n.language],
                          })}
                        </p>
                      )}

                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};