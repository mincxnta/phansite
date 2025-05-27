import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../../constants/constants.js'
import { showReportPopup } from '../popups/ReportPopup.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTranslation } from 'react-i18next'
import { errorHandler } from '../../utils/errorHandler.js';
import { toast } from 'react-toastify';
import { showConfirmToast } from '../popups/ConfirmToast.jsx'
import { motion, useMotionValue, animate } from 'framer-motion';
import { Pagination } from '../../components/Pagination.jsx';
import { SubmitButton } from '../../components/SubmitButton.jsx';

export const CommentSection = ({ pollId, ref }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [anonymous, setAnonymous] = useState(false)
    const limit = 5;
    const { user } = useAuth()
    const navigate = useNavigate()
    const { t } = useTranslation();
    const rotateY = useMotionValue(0);
    const [displayedImage, setDisplayedImage] = useState(
        anonymous
            ? '/assets/images/unknownTarget.png'
            : user?.profilePicture || '/assets/images/unknownTarget.png'
    );

    const fetchComments = async () => {
        try {
            const response = await fetch(`${API_URL}/comments/${pollId}?page=${page}&limit=${limit}`, {
                method: 'GET',
                credentials: 'include',
            });

            const data = await response.json();
            if (response.ok) {
                setComments(data.comments);
                setTotalPages(data.totalPages);
            } else {
                toast.error(t(errorHandler(data)))
            }
        } catch (error) {
            toast.error(t(errorHandler(error)))
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault()
        if (!user) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/comments/${pollId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: newComment, anonymous }),
                credentials: 'include',
            });

            const data = await response.json();
            if (response.ok) {
                setNewComment('');
                await fetchComments()
                setPage(1);
            } else {
                toast.error(t(errorHandler(data)))
            }
        } catch (error) {
            toast.error(t(errorHandler(error)))
        }
    };

    const handleReport = (type, postId) => {
        if (!user) {
            navigate('/login')
            return
        }
        showReportPopup(type, postId)
    }

    useEffect(() => {
        fetchComments()
    }, [pollId, page]);

    const handleDeleteClick = (commentId) => {
        showConfirmToast(
            t('toast.report.comment'),
            () => handleDelete(commentId),
            () => { }
        );
    };


    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${API_URL}/comments/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            })

            if (response.ok) {
                await response.json()
                toast.success(t("success.delete.comment"))
                setComments((prevComments) => prevComments.filter(comment => comment.id !== id));
                fetchComments();
            }
        } catch (error) {
            toast.error(t(errorHandler(error)))
        }
    }

    useEffect(() => {
        const from = rotateY.get();
        const to = anonymous ? 180 : 0;

        const controls = animate(from, to, {
            duration: 0.7,
            onUpdate: (latest) => {
                rotateY.set(latest);
                if ((from < to && latest >= 90) || (from > to && latest <= 90)) {
                    setDisplayedImage(anonymous ? '/assets/images/anonymous.png' : user?.profilePicture || '/assets/images/unknownTarget.png');
                }
            }
        });

        return () => controls.stop();
    }, [anonymous, user]);

    return (
        <div>
            <h1 ref={ref} className='text-[3.5rem] sm:text-[5rem]'>{t("comments.title")}</h1>
            <div className="flex justify-center flex-col items-center w-full">
                <div className="relative w-[80%] lg:w-1/2 mb-6">
                    <div className="absolute left-0 top-[1em] z-10">
                        <motion.div
                            style={{ rotateY, perspective: '1000px' }}
                            className="w-[80px] h-[80px] bg-white outline-6 outline-black border-6 border-white transform skew-x-6"
                        >
                            <img
                                src={displayedImage}
                                alt="Profile picture"
                                className="w-full h-full object-cover"
                            />
                        </motion.div>
                    </div>
                    <form className="mt-[2rem] relative flex flex-col items-center sm:flex-row sm:gap-[3.5em]" onSubmit={handleAddComment}>
                        <div className="ml-[4rem] px-6 py-2 transform -skew-x-6 bg-white border-2 border-black relative w-[90%]">
                            <div className="skew-x-6 p-[0.5rem] break-words text-black text-xl h-full">
                                <textarea className="resize-none h-full w-[90%]" value={newComment} placeholder={t("comments.placeholder")} onChange={(e) => setNewComment(e.target.value)}
                                    required disabled={!user || user?.role !== 'fan'}
                                > </textarea>
                            </div>
                        </div>
                        <div className="ml-0 sm:ml-4 mt-2 flex flex-col items-center w-[10%] gap-[1em]">
                            <div className="flex text-xl gap-[.5em]">
                                <input
                                    type="checkbox"
                                    checked={anonymous}
                                    disabled={!user || user?.role !== 'fan'}
                                    onChange={(e) => setAnonymous(e.target.checked)}
                                />
                                <label>
                                    {t("comments.anonymous")}
                                </label>
                            </div>

                            <SubmitButton
                                disabled={!user || user?.role !== 'fan'}
                                text={t("send")}
                            />
                        </div>
                    </form>
                </div>
            </div>
            {comments.length === 0 ? (
                <p>{t("comments.none")}</p>
            ) : (
                <div className="flex justify-center flex-col items-center">
                    {comments.map((comment) => (
                        <div className="w-full max-w-[90%] mb-6 lg:max-w-1/2 2xl:max-w-1/3" key={comment.id}>
                            <div className="relative min-w-3xs">
                                <div className="absolute left-0 z-10">
                                    <div className={`w-[80px] h-[80px] bg-white outline-6 outline-black border-6 border-white ${comment.anonymous || comment.user?.banned ? "" : "transition-transform hover:scale-[1.1]"} transform -skew-x-4`}>
                                        {comment.anonymous ? (
                                            <img
                                                src={
                                                    "/assets/images/anonymous.png"
                                                }
                                                alt="Profile picture"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : comment.user?.banned ? (
                                            <img
                                                src="/assets/images/unknownTarget.png"
                                                alt="Profile picture"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <Link to={`/profile/${comment.user.username}`}>
                                                <img
                                                    src={
                                                        comment.user?.profilePicture ||
                                                        "/assets/images/unknownTarget.png"
                                                    }
                                                    alt="Profile picture"
                                                    className="w-full h-full object-cover"
                                                />
                                            </Link>
                                        )}
                                    </div>
                                </div>
                                <div className="absolute left-20 sm:left-24 top-[-1.5rem] sm:top-[-2rem] z-20 max-w-[350px] ">
                                    <span className={`font-earwig text-3xl sm:text-4xl  text-white text-border ${comment.anonymous || comment.user?.banned ? "" : "transition-[color] hover:text-[#FF0000]"}`}>
                                        {comment.anonymous ? (
                                            t("anonymous")
                                        ) : comment.user?.banned ? (
                                            t('users.banned')
                                        ) : (
                                            <Link to={`/profile/${comment.user.username}`}>
                                                {comment.user.username}
                                            </Link>
                                        )}
                                    </span>
                                </div>
                                <div className="ml-[4rem] mt-[2rem] relative">
                                    <div
                                        className="px-6 py-2 transform bg-white border-2 border-black relative -skew-x-1 lg:-skew-x-6"
                                    >
                                        <div className="p-[0.5rem] break-words skew-x-1" >
                                            <p className="text-lg font-semibold text-black">{comment.text}</p>
                                        </div>
                                        <div className="absolute -top-3 -right-1 z-30">
                                            {user?.role === "fan" && (
                                                <button
                                                    onClick={() => handleReport("comment", comment.id)}
                                                    className="relative bg-white border-2 border-black transform -rotate-6 -skew-x-6 px-2 py-1 transition-transform hover:rotate-6"
                                                >
                                                    <img
                                                        src="/assets/images/icons/report.png"
                                                        alt="Reportar comentari"
                                                        className="h-4"
                                                    />
                                                </button>
                                            )}
                                            {user?.role === "admin" && (
                                                <button
                                                    onClick={() => handleDeleteClick(comment.id)}
                                                    className="relative bg-white border-2 border-black transform -skew-x-6 px-2 py-1 ml-2"
                                                >
                                                    <img
                                                        src="/assets/images/icons/delete.png"
                                                        alt="Esborrar comentari"
                                                        className="h-4"
                                                    />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )
            }

            {
                totalPages > 1 && (
                    <Pagination
                        page={page}
                        totalPages={totalPages}
                        onPageChange={(newPage) => setPage(newPage)}
                    />
                )
            }
        </div >
    )
}