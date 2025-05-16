import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../../constants/constants.js'
import { showReportPopup } from '../popups/ReportPopup.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTranslation } from 'react-i18next'
import { errorHandler } from '../../utils/errorHandler.js';
import { toast } from 'react-toastify';
import { showConfirmToast } from '../popups/ConfirmToast.jsx'
import { useDisplayUsername } from '../../utils/displayUsername.js'
import { motion } from 'framer-motion';
import { Pagination } from '../../components/Pagination.jsx';
import { SubmitButton } from '../../components/SubmitButton.jsx';

export const CommentSection = ({ pollId, ref }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalComments, setTotalComments] = useState(0);
    const [anonymous, setAnonymous] = useState(false)
    const limit = 5;
    const { user } = useAuth()
    const navigate = useNavigate()
    const { t } = useTranslation();
    const displayUsername = useDisplayUsername();

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
                setTotalComments(data.totalComments);
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
                setTotalComments((prevTotal) => prevTotal - 1);
                fetchComments();
            }
        } catch (error) {
            toast.error(t(errorHandler(error)))
        }
    }
    return (
        <div>
            <h1 ref={ref}>{t("comments.title")}</h1>
            {/* <h4>{t("comments.add")}</h4> */}
            <div className="flex justify-center flex-col items-center w-full">
                <div className="relative w-1/2 mb-6">
                    <div className="absolute left-0 top-[1em] z-10">
                        <motion.div
                            initial={{ rotateY: 0 }}
                            animate={{ rotateY: anonymous ? 180 : 0 }}
                            transition={{ duration: 0.7 }}
                            style={{ perspective: '1000px' }}
                            className="w-[80px] h-[80px] bg-white outline-6 outline-black border-6 border-white transform skew-x-6"
                        >
                            <img src={
                                anonymous
                                    ? '/assets/anonymous.png'
                                    : user && user.profilePicture
                                        ? user.profilePicture
                                        : '/assets/requests/unknownTarget.png'
                            }
                                alt={"Profile picture"}
                                className="w-full h-full object-cover" />
                        </motion.div>
                    </div>
                    <form className="ml-[4rem] mt-[2rem] relative flex gap-[3.5em]" onSubmit={handleAddComment}>
                        <div className="px-6 py-2 transform -skew-x-6 bg-white border-2 border-black relative w-[90%]">
                            <div className="skew-x-6 p-[0.5rem] break-words text-black text-xl h-full">
                                <textarea value={newComment} placeholder={t("comments.placeholder")} onChange={(e) => setNewComment(e.target.value)}
                                    style={{ resize: "none", width: "90%", height: "100%" }}
                                    required disabled={!user || user?.role !== 'fan'}
                                > </textarea>
                            </div>
                        </div>
                        <div className="mt-2 flex flex-col items-center w-[10%] gap-[1em]">
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
                                text={t("comments.send")}
                            />
                        </div>
                    </form>
                </div>
            </div>
            <h4>{t("comments.title")}: ({totalComments})</h4>
            {comments.length === 0 ? (
                <p>{t("comments.none")}</p>
            ) : (
                <div className="flex justify-center flex-col items-center">
                    {comments.map((comment) => (
                        <div className="w-full max-w-1/3 mb-6" key={comment.id}>
                            <div className="relative min-w-3xs">
                                <div className="absolute left-0 z-10">
                                    <div className="w-[80px] h-[80px] bg-white outline-6 outline-black border-6 border-white transform -skew-x-4">
                                        {comment.anonymous ? (
                                            <img
                                                src={
                                                    "/assets/requests/unknownTarget.png"
                                                }
                                                alt="Profile picture"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <Link to={`/profile/${displayUsername(comment.user)}`}>
                                                <img
                                                    src={
                                                        comment.user?.profilePicture ||
                                                        "/assets/requests/unknownTarget.png"
                                                    }
                                                    alt="Profile picture"
                                                    className="w-full h-full object-cover"
                                                />
                                            </Link>
                                        )}
                                    </div>
                                </div>
                                <div className="absolute left-24 top-[-2rem] z-20">
                                    <span className="font-earwig text-4xl w-fit text-white text-border">
                                        {comment.anonymous ? (
                                            t("anonymous")
                                        ) : (
                                            <Link to={`/profile/${displayUsername(comment.user)}`}>
                                                {displayUsername(comment.user)}
                                            </Link>
                                        )}
                                    </span>
                                </div>
                                <div className="ml-[4rem] mt-[2rem] relative">
                                    <div
                                        className="px-6 py-2 transform -skew-x-6 bg-white border-2 border-black relative"
                                    >
                                        <div className="skew-x-6 p-[0.5rem] break-words">
                                            <p className="text-lg font-semibold text-black">{comment.text}</p>
                                        </div>
                                        <div className="absolute -top-3 -right-1 z-30">
                                        {user?.role === "fan" && (
                                            <button
                                                onClick={() => handleReport("comment", comment.id)}
                                                className="relative bg-white border-2 border-black transform -rotate-6 -skew-x-6 px-2 py-1"
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
            )}

            {totalPages > 1 && (
                <Pagination
                    page={page}
                    totalPages={totalPages}
                    onPageChange={(newPage) => setPage(newPage)}
                />
            )}
        </div>
    )
}