import axios from 'axios';

export const uploadImage = async (img) => {
    try {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp','image/jpg']; // <-- allowed types
        if (!allowedTypes.includes(img.type)) {
            throw new Error('Unsupported file type');
        }
        const { data: { url } } = await axios.get('http://localhost:3000/api/create/get-upload-url', {
            params: { contentType: img.type }
        });
        await axios.put(url, img, {
            headers: { 'Content-Type': img.type }
        });

        const imgUrl = url.split("?")[0];
        return imgUrl;
    } catch (error) {
        console.error('Error uploading image:', error);
        return null;
    }
}