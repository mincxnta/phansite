import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../../constants/constants.js'
import { showReportForm } from '../report/Report.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTranslation } from 'react-i18next'
import { errorHandler } from '../../utils/errorHandler.js';

export const CommentSection = ({ pollId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalComments, setTotalComments] = useState(0);
    const [anonymous, setAnonymous] = useState(false)
    const limit = 5; // Comentaris per pàgina
    const { user } = useAuth()
    const navigate = useNavigate()
    const { t } = useTranslation();

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
                setError(errorHandler(data));
            }
        } catch (error) {
            setError(errorHandler(error));
        }
    };

    const handleAddComment = async () => {
        if (!user) {
            return;
        }

        // Si no lo pones, deja poner comentario vacío


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
                setError(null);
                await fetchComments()
            } else {
                console.log(data.code[0])
                setError(errorHandler(data));
            }
        } catch (error) {
            setError(errorHandler(error));
        }
    };

    const handleReport = (type, postId) => {
        if (!user) {
            navigate('/login')
            return
        }
        showReportForm(type, postId)
    }
    useEffect(() => {
        fetchComments()
    }, [pollId, page]);

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${API_URL}/comments/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            })

            if (response.ok) {
                await response.json()
                setComments((prevComments) => prevComments.filter(comment => comment.id !== id));
            }
        } catch (error) {
            setError(errorHandler(error));
        }
    }
    return (
        <div>
            <h1>{t("comments.title")}</h1>
            <h4>{t("comments.add")}</h4>
            {error && <p>{t(error)}</p>}
            <div style={{ display: "flex" }}>
                <img src={user && user.profilePicture ? user.profilePicture : '/assets/requests/unknownTarget.png'} alt={"Profile picture"} style={{ maxHeight: '50px' }} />
                <textarea value={newComment} placeholder={t("comments.placeholder")} onChange={(e) => setNewComment(e.target.value)}
                    style={{ maxHeight: "50px", resize: "none", width: "90%" }}
                    required disabled={!user}
                > </textarea>
                <label>
                    <input
                        type="checkbox"
                        checked={anonymous}
                        disabled={!user}
                        onChange={(e) => setAnonymous(e.target.checked)}
                    />
                    {t("comments.anonymous")}
                </label>
                <button onClick={handleAddComment}
                    disabled={!user}
                >{t("comments.send")}</button>
            </div>
            <h4>{t("comments.title")}: ({totalComments})</h4>
            {comments.length === 0 ? (
                <p>{t("comments.none")}</p>
            ) : (
                comments.map((comment) => (
                    <div key={comment.id} style={{ display: "flex" }}>
                        <img src={comment.user?.profilePicture ? comment.user.profilePicture : '/assets/requests/unknownTarget.png'} alt="Profile picture" style={{ maxHeight: '50px' }} />
                        <div style={{ resize: "none", width: "90%", padding: "4px" }}>
                            <div style={{ display: "flex" }}>
                                <p style={{ fontWeight: "bolder", margin: "0" }}>{comment.anonymous ? t("anonymous") : (<Link to={`/profile/${comment.user.username}`}>{comment.user.username}</Link>)}</p>
                                <button onClick={() => handleReport("comment", comment.id)}>
                                    <img src={'/assets/report.png'} alt="Report comment" style={{ maxHeight: '16px' }} />
                                </button>
                                {user && (user.role === 'admin') &&
                                    <button onClick={() => handleDelete(comment.id)}>
                                        <img src={'/assets/delete.png'} alt="Report comment" style={{ maxHeight: '16px' }} />
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
                        Página {page} de {totalPages}
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