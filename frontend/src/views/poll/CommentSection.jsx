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

export const CommentSection = ({ pollId }) => {
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

    const handleAddComment = async () => {
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
            t('confirmToast.banMessage'),
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
            <h1>{t("comments.title")}</h1>
            <h4>{t("comments.add")}</h4>
            <div className="flex items-center gap-2.5">
                <motion.div
                    initial={{ rotateY: 0 }}
                    animate={{ rotateY: anonymous ? 180 : 0 }}
                    transition={{ duration: 0.7 }}
                    style={{ perspective: '1000px' }}
                >
                    <img src={
                        anonymous
                            ? '/assets/anonymous.png'
                            : user && user.profilePicture
                                ? user.profilePicture
                                : '/assets/requests/unknownTarget.png'
                    }
                        alt={"Profile picture"} style={{ maxHeight: '50px' }} />
                </motion.div>
                <textarea value={newComment} placeholder={t("comments.placeholder")} onChange={(e) => setNewComment(e.target.value)}
                    style={{ maxHeight: "50px", resize: "none", width: "90%" }}
                    required disabled={!user || user?.role !== 'fan'}
                > </textarea>
                <label>
                    <input
                        type="checkbox"
                        checked={anonymous}
                        disabled={!user || user?.role !== 'fan'}
                        onChange={(e) => setAnonymous(e.target.checked)}
                    />
                    {t("comments.anonymous")}
                </label>
                <button onClick={handleAddComment}
                    disabled={!user || user?.role !== 'fan'}
                >{t("comments.send")}</button>
            </div>
            <h4>{t("comments.title")}: ({totalComments})</h4>
            {comments.length === 0 ? (
                <p>{t("comments.none")}</p>
            ) : (
                comments.map((comment) => (
                    <div key={comment.id} style={{ display: "flex" }}>
                        {!comment.anonymous ?
                            (<Link to={`/profile/${comment.user.username}`}><img src={comment.user?.profilePicture && !comment.anonymous ? comment.user.profilePicture : '/assets/requests/unknownTarget.png'} alt="Profile picture" style={{ maxHeight: '50px' }} /></Link>)
                            : (<img src={comment.user?.profilePicture && !comment.anonymous ? comment.user.profilePicture : '/assets/requests/unknownTarget.png'} alt="Profile picture" style={{ maxHeight: '50px' }} />)}

                        <div style={{ resize: "none", width: "90%", padding: "4px" }}>
                            <div style={{ display: "flex" }}>
                                <p style={{ fontWeight: "bolder", margin: "0" }}>{comment.anonymous ? t("anonymous") : (<Link to={`/profile/${comment.user.username}`}>{displayUsername(comment.user)}</Link>)}</p>
                                <button onClick={() => handleReport("comment", comment.id)}>
                                    <img src={'/assets/images/icons/report.png'} alt="Report comment" style={{ maxHeight: '16px' }} />
                                </button>
                                {user && (user.role === 'admin') &&
                                    <button onClick={() => handleDeleteClick(comment.id)}>
                                        <img src={'/assets/images/icons/delete.png'} alt="Delete comment" style={{ maxHeight: '16px' }} />
                                    </button>
                                }
                            </div>

                            <p style={{ margin: "0" }}>{comment.text}</p>
                        </div>
                    </div>
                ))
            )}

            {totalPages > 1 && (
                <div>
                    <button
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        disabled={page === 1}
                    >
                        {t("previous")}
                    </button>
                    <span>
                        {t('pagination', { page, totalPages })}
                    </span>
                    <button
                        onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={page === totalPages}
                    >
                        {t("next")}
                    </button>
                </div>
            )}
        </div>
    )
}