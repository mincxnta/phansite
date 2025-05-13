import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link, useParams } from 'react-router-dom'
import { API_URL } from '../../constants/constants.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { useTranslation } from 'react-i18next'
import { RequestList } from '../request/RequestList.jsx'
import { format } from 'date-fns';
import { locales } from '../../utils/dateLocales.js'
import { toast } from 'react-toastify';
import { errorHandler } from '../../utils/errorHandler.js';
import { Loading } from '../../components/Loading.jsx'
import { SubmitButton } from '../../components/SubmitButton.jsx'

export const UserProfile = () => {
    const [profileUser, setProfileUser] = useState(null)
    const navigate = useNavigate()
    let { username } = useParams()
    const { user, error: authError } = useAuth()
    const { t, i18n } = useTranslation();

    useEffect(() => {
        const fetchProfile = async () => {
            if (!username && user) {
                setProfileUser(user)
                username = user.username
                return;
            }
            try {
                const response = await fetch(`${API_URL}/users/${username}`, {
                    method: 'GET',
                    // credentials: 'include'
                })

                if (!response.ok) {
                    navigate('/login')
                    return;

                }
                const data = await response.json()
                setProfileUser(data)

                if (user && user.username === username) {
                    navigate('/profile', { replace: true });
                }
            } catch (error) {
                toast.error(t(errorHandler(error)))
                navigate('/')

            }
        }
        fetchProfile()
    }, [navigate, username, user])

    // const handleDelete = async () => {
    //     try {
    //         const response = await fetch(`${API_URL}/users/delete`, {
    //             method: 'DELETE',
    //             credentials: 'include'
    //         })

    //         if (response.ok) {
    //             await response.json()
    //             navigate('/login')
    //         }
    //     } catch (error) {
    //         setError(errorHandler(error));
    //     }
    // }

    if (!profileUser) {
        return <Loading />;
    }

    const isOwnProfile = !username || user && user.username === username

    const formattedDate = format(new Date(profileUser.registrationDate), 'dd-MM-yyyy', {
        locale: locales[i18n.language],
    });

    return (
        <div>
            {authError && t(authError)}
            <div className="h-[90vh] flex flex-col justify-center">
                <h1>{isOwnProfile ? t("profile.me") : t("profile.user", { username: profileUser.username })}</h1>
                <div className="flex items-center justify-center gap-15 mt-3">
                    <div className="flex items-center flex-col h-[40vh] ">
                        <img className="border-10 border-black skew-x-4 mb-3" src={profileUser.profilePicture || '/assets/requests/unknownTarget.png'} />
                        {isOwnProfile && (
                            <>
                                <Link to="edit">
                                    <img className="w-10" src="/assets/images/icons/edit.png" />
                                </Link>

                            </>)}
                        {!isOwnProfile && (
                            <Link to={`/chat/${profileUser.username}`}>
                                <img className="w-10" src="/assets/images/icons/message.png" />
                            </Link>
                        )}
                    </div>
                    <div>
                        <div className="h-[35vh] w-[25vw] bg-white -skew-x-3 box-shadow flex items-center justify-center">
                            <span className="absolute top-2 left-2">
                                <img src="/assets/images/icons/star-black.png" alt="Star" className="w-6 h-6" />
                            </span>
                            <span className="absolute top-2 right-2">
                                <img src="/assets/images/icons/star-red.png" alt="Star" className="w-6 h-6" />
                            </span>
                            <span className="absolute bottom-2 left-2">
                                <img src="/assets/images/icons/star-black.png" alt="Star" className="w-6 h-6" />
                            </span>
                            <span className="absolute bottom-2 right-2">
                                <img src="/assets/images/icons/star-red.png" alt="Star" className="w-6 h-6" />
                            </span>
                            <p className="text-black text-3xl">{`${profileUser.aboutMe}`}</p>
                        </div>
                        <p className="mt-6 font-header">{t("profile.date", { date: formattedDate })}</p>
                    </div>
                </div>
            </div>
            {isOwnProfile && user.role === 'fan' && (
                <div className="-mt-20">
                    <RequestList profile />
                </div>
            )}
        </div>
    )
}