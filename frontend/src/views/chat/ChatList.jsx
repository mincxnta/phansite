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
                    message: newMessage.message || (newMessage.image ? '[Imatge]' : ''),
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
      <div className="container mx-auto p-4">
        {contacts.length === 0 ? (
          <p className="text-white">{t('chat.empty.chat')}</p>
        ) : (
          <div className="flex justify-center">
            <ul className="w-full max-w-[600px]">
              {contacts.map((contact) => (
                <li
                  key={contact.id}
                  onClick={() => handleContactClick(contact.username)}
                  className="mb-6"
                >
                  <div className="relative w-full">
                    <div className="absolute left-0 z-10">
                      <div className="w-[80px] h-[80px] bg-white outline-6 outline-black border-6 border-white transform -skew-x-6">
                        <img
                          src={
                            contact.profilePicture || "/assets/requests/unknownTarget.png"
                          }
                          alt={displayUsername(contact)}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="absolute left-24 top-[-2rem] z-20">
                      <span className="font-earwig text-4xl w-fit text-white text-border">
                        {displayUsername(contact)}
                      </span>
                    </div>
                    <div className="ml-[5rem] mt-[2rem] relative">
                      <div
                        className="px-6 py-2 transform -skew-x-6 bg-black border-2"
                      >
                        <div className="skew-x-6 p-[0.5rem] break-words">
                          <p className="text-lg font-semibold text-white text-left">
                            {contact.lastMessage?.message?.length > 40
                              ? `${contact.lastMessage.message.slice(0, 40)}...`
                              : contact.lastMessage.message || t('chat.empty.message')}
                          </p>
                        </div>
                      </div>
                    </div>
                    {contact.lastMessage?.date && (
                      <p className="text-white ml-[6rem] mt-2 text-right">
                        {formatDistanceToNow(new Date(contact.lastMessage.date), {
                          addSuffix: true,
                          locale: locales[i18n.language],
                        })}
                      </p>
                    )}
                    {onlineUsers.includes(contact.id) && (
                      <span className="online-indicator absolute left-[90px] top-[70px]"></span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};