import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../constants/constants'
import { showReportForm } from '../report/Report.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTranslation } from 'react-i18next'

export const Comments = ({ pollId }) => {
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

            if (response.ok) {
                const data = await response.json();
                setComments(data.comments);
                setTotalPages(data.totalPages);
                setTotalComments(data.totalComments);
            } else {
                console.log('Error al obtenir els comentaris:', response.status);
            }
        } catch (error) {
            console.log('Error de xarxa:', error);
        }
    };

    const handleAddComment = async () => {
        if (!user) {
            return;
        }

        if (!newComment.trim()) {
            setError('El comentario no puede estar vacío');
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

            if (response.ok) {
                setNewComment('');
                setError(null);
                await fetchComments()
            } else {
                const errorData = await response.json();
                setError(errorData.message);
            }
        } catch (error) {
            console.log('Error de xarxa:', error);
            setError('Error al enviar el comentario');
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
    return (
        <div>
            <h1>{t("comments")}</h1>
            <h4>{t("comment.add")}</h4>
            {error && <p>{error}</p>}
            <div style={{ display: "flex" }}>
                <img src={user && user.profilePicture ? user.profilePicture : '/assets/requests/unknownTarget.png'} alt={"Profile picture"} style={{ maxHeight: '50px' }} />
                <textarea value={newComment} placeholder={t("comment.placeholder")} onChange={(e) => setNewComment(e.target.value)}
                    style={{ maxHeight: "50px", resize: "none", width: "90%" }}
                disabled={!user}
                > </textarea>
                <label>
                    <input
                        type="checkbox"
                        checked={anonymous}
                        disabled={!user}
                        onChange={(e) => setAnonymous(e.target.checked)}
                    />
                    {t("comment.anonymous")}
                </label>
                <button onClick={handleAddComment}
                disabled={!user}
                >{t("comment.send")}</button>
            </div>
            <h4>{t("comments")}: ({totalComments})</h4>
            {comments.length === 0 ? (
                <p>{t("no.comments")}</p>
            ) : (

                comments.map((comment) => (
                    <div key={comment.id} style={{ display: "flex" }}>
                        <img src={comment.user?.profilePicture ? comment.user.profilePicture : '/assets/requests/unknownTarget.png'} alt="Profile picture" style={{ maxHeight: '50px' }} />
                        <div style={{ maxHeight: "100px", resize: "none", width: "90%", padding: "4px" }}>
                            <div style={{ display: "flex" }}>
                                <p style={{ fontWeight: "bolder", margin: "0" }}>{comment.anonymous ? t("anonymous") : comment.user.username}</p>
                                <button onClick={() => handleReport("comment", comment.id)}>
                                    <img src={'/assets/report.png'} alt="Report comment" style={{ maxHeight: '16px' }} />
                                </button>
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