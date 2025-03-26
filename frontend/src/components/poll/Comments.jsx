import React from 'react'
export const Comments = () => {
    return (
        <div>
            <div style="display: flex;">
                <img src={request.image ? request.image : '/assets/requests/unknownTarget.png'} alt={request.target} style={{ maxHeight: '50px' }} />
                <textarea name="" id="" placeholder="Your comment here..."
                    style="max-height: 50px; resize: none; width: 90%;"></textarea>
                <button>Send</button>
            </div>

            <div style="display: flex;">
                <img src={request.image ? request.image : '/assets/requests/unknownTarget.png'} alt={request.target} style={{ maxHeight: '50px' }} />
                <div style="max-height: 100px; resize: none; width: 90%; padding: 4px;">
                    <p style="font-weight: bolder; margin: 0;"> Jesus Cristo</p>
                    <p style="margin: 0;"> LALLALALALALALALALALALA lorem ipsum dolor sit amet</p>
                </div>
            </div>

            <div style="display: flex;">
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
            </div>
        </div>
    )
}