const BlogContent = ({ block }) => {
    const { type, data } = block;
    if (type === 'paragraph') {
        return <p dangerouslySetInnerHTML={{ __html: data.text }}></p>;
    }
    else if (type === 'header') {
        const { text, level } = data;
        if (level === 2) {
            return <h2 dangerouslySetInnerHTML={{ __html: text }}></h2>;
        }
        else if (level === 3) {
            return <h3 dangerouslySetInnerHTML={{ __html: text }}></h3>;
        }
    } else if (type === 'image') {
        const { caption, file } = data;
        return (
            <div>
                <img src={file.url} />
                {caption && <p dangerouslySetInnerHTML={{ __html: caption }} className='w-full text-center my-3 md:mb-12 text-base text-dark-grey'></p>}
            </div>
        )
    } else if (type === 'quote') {
        const { text, caption } = data;
        return (
            <div className='bg-purple/10 p-3 pl-5 border-l-4 border-purple'>
                <p className='text-xl leading-10 md:text-2xl' dangerouslySetInnerHTML={{ __html: text }}></p>
                {caption && <p dangerouslySetInnerHTML={{ __html: caption }} className='w-full text-purple text-base'></p>}
            </div>
        )
    }
    else if (type === 'code') {
        const { code } = data;
        return (
            <pre className='bg-grey/80 p-4 rounded overflow-x-auto my-4'>
                <code className='text-xl font-mono whitespace-pre-wrap'>
                    {code}
                </code>
            </pre>
        );
    }
    else if (type === 'list') {
        const { items, style } = data;
        return (
            <ol className={`pl-5 ${style === 'ordered' ? 'list-decimal' : 'list-disc'}`}>
                {
                    items.map((listItem, index) => {
                        if(listItem.content){
                            return <li key={index} className='my-2'>{listItem.content}</li>
                        }else{
                            return <li key={index} className='my-2' dangerouslySetInnerHTML={{ __html: listItem}}></li>
                        }
                    })
                }
            </ol>
        )
    }
    else {
        return <h1>This Is Block</h1>
    }
}

export default BlogContent