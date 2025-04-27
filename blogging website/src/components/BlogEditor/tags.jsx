import React from 'react'
import { useEditor } from '../../context/editorContext'

export const Tags = ({ tag, tagIndex }) => {
    let { blog: { tags }, setBlog } = useEditor();

    const handleDeleteTag = () => {
        tags = tags.filter((t) => t !== tag);
        setBlog((prev) => ({ ...prev, tags }));
    }

    const handleTagEdit = (e) => {
        if (e.key === 'Enter' || e.key === 'Comma') {
            e.preventDefault();
            const currentTag = e.target.innerText;
            if (!tags.includes(currentTag) && currentTag.length) {
                tags[tagIndex] = currentTag;
                setBlog((prev) => ({ ...prev, tags }));
                e.target.setAttribute('contenteditable', 'false');
            }
            console.log(tags);
        }
    }
    const addEditable = (e) => {
        e.target.setAttribute('contenteditable', 'true');
        e.target.focus();
    }

    return (
        <div className='relative p-2 mt-2 mr-2 px-5 bg-white rounded-full inline-block hover:bg-opacity-50 pr-8'>
            <p className='outline-none' onKeyDown={handleTagEdit} onClick={addEditable}>
                {tag}
            </p>
            <button
                className='mt-[2px] rounded-full absolute right-3 top-1/2 -translate-y-1/2'
                onClick={handleDeleteTag}
            >
                <i className='fi fi-br-cross text-sm pointer-events-none'></i>
            </button>
        </div>
    )
}
