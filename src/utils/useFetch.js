const useFetch = async (fetchUrl, fetchMethod, fetchBody, fetchHeaders, fetchResponseMethod) => {

    const url = fetchUrl;
    const method = fetchMethod ? fetchMethod : 'get';
    const body = fetchBody ? JSON.stringify(fetchBody) : null;
    const headers = fetchHeaders ? fetchHeaders : {
        'Content-type': 'application/json'
    };
    
    try {
        const response = await fetch(url, { method, headers, body });

        if (!response.ok) {
            console.error(`Could not fetch ${url}, status: ${response.status}`);
            return false;
        }

        switch(fetchResponseMethod) {
            case 'text': return await response.text();
            default: return await response.json();
        }
    } catch(error) {
        console.log(error.message);
        return false;
    }
}

export default useFetch;