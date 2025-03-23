export const AddRequest = () => {

    const [target, setTarget] = useState('')
    const [description, setDescription] = useState('')
    const [image, setImage] = useState('')

    return (
        <div>
            <h1>AddRequest</h1>
            <form>
                <label>Target</label>
                <input type="text" required value={target} onChange={(e) => setTarget(e.target.value)} placeholder="Enter your username" />
                <br />
                <label>Description</label>
                <input type="text" required value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter your password" />
                <br />
                <label>Target image</label>
                <input type="image" value={image} onChange={(e) => setImage(e.target.value)} />
                <input type="submit" value="Send Request" />
            </form>
        </div>
    )
}