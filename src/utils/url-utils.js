// Parses URL search parameters into the object
export const parseUrlParams = search => {
    const params = new URLSearchParams(search);
    let obj = {};
    for (let v of params.entries()) {
        obj = {
            ...obj,
            [v[0]]: v[1]
        };
    }
    return obj;
}