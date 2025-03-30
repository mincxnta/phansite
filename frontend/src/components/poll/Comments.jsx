import React from 'react'
import { useState, useEffect } from 'react';
import { API_URL } from '../../constants/constants'
import { showReportForm } from '../report/Report.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export const Comments = ({ pollId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalComments, setTotalComments] = useState(0);
    const [anonymous, setAnonymous] = useState(false)
    const limit = 5; // Comentaris per pàgina
    const { user } = useAuth

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

    // Funció per afegir un nou comentari
    const handleAddComment = async () => {
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

    useEffect(() => {
        fetchComments()
    }, [pollId, page]);
    return (
        <div>
            <h1>Comentarios</h1>
            <h4>Añadir comentario</h4>
            {error && <p>{error}</p>}
            <div style={{ display: "flex" }}>
                <img src={user && user.profilePicture ? user.profilePicture : '/assets/requests/unknownTarget.png'} alt={"Profile picture"} style={{ maxHeight: '50px' }} />
                <textarea value={newComment} placeholder="Your comment here..." onChange={(e) => setNewComment(e.target.value)}
                    style={{ maxHeight: "50px", resize: "none", width: "90%" }}></textarea>
                <label>
                    <input
                        type="checkbox"
                        checked={anonymous}
                        onChange={(e) => setAnonymous(e.target.checked)}
                    />
                    Comentar como anónimo
                </label>
                <button onClick={handleAddComment}>Send</button>
            </div>
            <h4>Comentarios ({totalComments})</h4>
            {comments.length === 0 ? (
                <p>No hay comentarios</p>
            ) : (

                comments.map((comment) => (
                    <div key={comment.id} style={{ display: "flex" }}>
                        <img src={comment.user?.profilePicture ? comment.user.profilePicture : '/assets/requests/unknownTarget.png'} alt="Profile picture" style={{ maxHeight: '50px' }} />
                        <div style={{ maxHeight: "100px", resize: "none", width: "90%", padding: "4px" }}>
                            <div style={{ display: "flex" }}>
                                <p style={{ fontWeight: "bolder", margin: "0" }}>{comment.anonymous ? "Anon" : comment.user.username}</p>
                                <button onClick={() => showReportForm("comment", comment.id)}>
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
                        Previous
                    </button>
                    <span>
                        Página {page} de {totalPages}
                    </span>
                    <button
                        onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={page === totalPages}
                    >
                        Next
                    </button>
                </div>
            )}




            {/* <div style="display: flex;">
                <img src={request.image ? request.image : '/assets/requests/unknownTarget.png'} alt={request.target} style={{ maxHeight: '50px' }} />
                <div style="max-height: 100px; resize: none; width: 90%; padding: 4px;">
                    <p style="font-weight: bolder; margin: 0;"> Lucifer</p>
                    <p style="margin: 0;"> OS VOY A MATAR</p>
                </div>
            </div>

            <div style="display: flex;">
                <img src={request.image ? request.image : '/assets/requests/unknownTarget.png'} alt={request.target} style={{ maxHeight: '50px' }} />
                <div style="max-height: 100px; resize: none; width: 90%; padding: 4px;">
                    <p style="font-weight: bolder; margin: 0;"> Admin</p>
                    <p style="margin: 0;"> Lucifer te vas baneado</p>
                </div>
            </div>

            <div style="display: flex;">
                <img src={request.image ? request.image : '/assets/requests/unknownTarget.png'} alt={request.target} style={{ maxHeight: '50px' }} />
                <div style="max-height: 100px; resize: none; width: 90%; padding: 4px;">
                    <p style="font-weight: bolder; margin: 0;"> Anon</p>
                    <p style="margin: 0;"> LOL</p>
                </div>
            </div> */}
        </div>
    )
}