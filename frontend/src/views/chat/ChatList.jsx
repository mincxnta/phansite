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
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
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

  const fetchSearchResults = async (query) => {
    if (!query) {
      setSearchResults([]);
      return;
    }
    try {
      const url = user.role === 'fan' ? `${API_URL}/users/fans` : `${API_URL}/users/list`;
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();
      if (response.ok) {
        const nonContacts = data.filter(
          (userData) => !contacts.some((contact) => contact.id === userData.id)
        );
        const filteredResults = nonContacts.filter((userData) =>
          userData.username.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(filteredResults);
      }
    } catch (error) {
      toast.error(t(errorHandler(error)));
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    fetchSearchResults(query);
  }

  const handleContactClick = (username) => {
    navigate(`/chat/${username}`);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="container mx-auto p-4 pt-20">
        <div className="absolute top-25 right-4 w-[95%] sm:w-64">
          <div className="relative">
            <div className="flex items-center bg-white text-black p-2 -skew-x-6 gap-2">
              <img src="/assets/images/icons/search.png" className="w-6 h-6" alt="Search Icon" />
              <input
                type="text"
                placeholder={t('search.user')}
                value={searchQuery}
                onChange={handleSearch}
                className="w-full bg-transparent focus:outline-none"
              />
            </div>
            {searchQuery && searchResults.length > 0 && (
              <ul className="absolute top-full left-0 w-full bg-white mt-1 border-2 border-black">
                {searchResults.map((user) => (
                  <li
                    key={user.id}
                    onClick={() => handleContactClick(user.username)}
                    className="text-black p-2 hover:bg-red-500 hover:text-white flex items-center"
                  >
                    <img
                      src={user.profilePicture || '/assets/images/unknownTarget.png'}
                      alt={displayUsername(user)}
                      className="w-8 h-8 rounded-full mr-2"
                    />
                    <span>{displayUsername(user)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
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
                        <div className="flex items-center">
                          <span className="font-earwig text-2xl sm:text-4xl w-fit text-white text-border">
                            {displayUsername(contact)}
                          </span>
                          {contact.role === "phantom_thief" &&
                            <img src="/assets/images/icons/mask.png" alt="" className='ml-2 h-12' />}
                        </div>
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