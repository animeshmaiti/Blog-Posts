import axios from "axios";

export const filterPaginationData = async ({
    create_new_arr = false,
    state,
    data,
    page,
    countRoute,
    data_to_send={}
}) => {
    let obj;
    if (state != null && !create_new_arr) {
        console.log(state);
        obj = { ...state, results: [...state.results, ...data], page: page };
    } else {
        try{
            const response = await axios.post('http://localhost:3000'+countRoute, data_to_send);
            const {totalDocs}=response.data;
            obj={
                results: data,
                page: 1,
                totalDocs: totalDocs
            }
        }catch(err){
            console.error(err);
        }
    }
    console.log(obj);
    return obj;
}
