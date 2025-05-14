import Embed from '@editorjs/embed';
import Header from '@editorjs/header';
import ImageTool from '@editorjs/image';
import List from '@editorjs/list';
import Quote from '@editorjs/quote';
import Marker from '@editorjs/marker';
import InlineCode from '@editorjs/inline-code';
import CodeTool from '@editorjs/code';
import { uploadImage } from '../../common/aws';

const uploadImageByURL = async (url) => {
    console.log('Received URL:', url);
    return {
        success: 1,
        file: { url }
    };
};

const uploadImageByFile = async (e) => {
    return await uploadImage(e).then(url => {
        if (url) {
            return {
                success: 1,
                file: { url }
            }
        }
    })
}

export const tools = {
    embed: {
        class: Embed,
        config: {
            services: {
                youtube: true,
                coub: true
            }
        }
    },
    list: {
        class: List,
        inlineToolbar: true
    },
    image: {
        class: ImageTool,
        config: {
            uploader: {
                uploadByFile: uploadImageByFile,
                uploadByUrl: uploadImageByURL
            }
        }
    },
    header: {
        class: Header,
        config: {
            placeholder: "Type Heading...",
            levels: [2, 3],
            defaultLevel: 2
        }
    },
    quote: {
        class: Quote,
        inlineToolbar: true
    },
    marker: Marker,
    inlineCode: InlineCode,
    code: CodeTool
}
