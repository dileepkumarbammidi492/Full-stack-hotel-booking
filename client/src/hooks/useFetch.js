import {useState, useEffect} from 'react'
import axios from 'axios'

const useFetch = (url) =>{
    const [data, setData] = useState([])
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)

    const fetchData = async (requestUrl) =>{
        setLoading(true)
        try{
            const response = await axios.get(requestUrl)
            setData(response.data)
            setError(false)
        }catch(err){
            setError(err)
        }
        setLoading(false)
    }

    useEffect(()=>{
        if(url){
          fetchData(url)
        }
    }, [url])

    const reFetch = async ()=>{
        if(url){
          await fetchData(url)
        }
    }

    return {data, loading, error, reFetch} 
}

export default useFetch;