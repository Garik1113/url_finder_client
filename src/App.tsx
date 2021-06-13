import { FC } from 'react';
import { useState } from 'react';
import { useCallback } from 'react';
import axios, { AxiosResponse } from 'axios';
import './app.css';
import { IUrlWithStatusCode } from './interfaces';

const App:FC = () =>  {
    const [link, setLink] = useState<String>("");
    const [findedUrlsWithStatusCodes, setFindedUrlsWithStatusCodes] = useState<IUrlWithStatusCode[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [total, setTotal] = useState<number>(0);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleChange = useCallback((e: any) => {
        const { value } = e.target;
        setLink(value)
    }, [setLink]);

    const handleClick = useCallback(async() => {
      setIsSubmitting(true)
      setTotal(0);
      setErrorMessage("");
      setFindedUrlsWithStatusCodes([])
      const response: AxiosResponse = await axios.get(`http://localhost:5000/scrap?link=${link}`);
      const { data } = response;
      if (data && data.statusCode === "OK") {
          setFindedUrlsWithStatusCodes(data.findedUrlsWithStatusCodes);
          setTotal(data.total);
      } else {
          setErrorMessage(data.errorMessage)
      }
      setIsSubmitting(false)
    }, [
        link, 
        setFindedUrlsWithStatusCodes, 
        setTotal,
        setErrorMessage,
        setIsSubmitting
      ]);

    return (
        <div className="root">
            <div className="header">
              <input className="input" onChange={handleChange}/>
              <button className="button" onClick={handleClick}>Find Urls</button>
            </div>
            { errorMessage ? <span className='errorMessage'>{errorMessage}</span> : null }
            { 
              total 
              ?   <div className='header'>
                      <span className="total">Total: {total} urls</span> 
                  </div>
              :   null
            }
            { isSubmitting ? <span className="loading">Fetching ...</span> : null }
            {
                findedUrlsWithStatusCodes && findedUrlsWithStatusCodes.length
                ?   <div className="list">
                        { findedUrlsWithStatusCodes.map(e => (
                            <div className="item" key={e.url}>
                                <a className="url" href={e.url} target={`_blank`}>{e.url}</a>
                                 <span className="status">Status: {e.status}</span>
                            </div>
                        ))}
                    </div>
                :   null
            }
        </div>
    );
}

export default App;
