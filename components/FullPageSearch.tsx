import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import Button from './Button';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import { splitTerms, joinTerms } from '../util/MongoDBBuilders';

const FullPageSearch = () => {

  const [query, setQuery] = useState(null);
  const router = useRouter();

  const count = (str:String, char:String) => {
    char=char.slice(0,1);
    let counter=0;
    for(let i in str){
      if(str[i]===char)
        counter++;
    }
    return counter;
  }

  const searchIsValid = () => {
    if(query===null || typeof query==='undefined' || query==='') { return true; }
    if(query.includes('(')||query.includes(')')){
      if(count(query, '(') !== count(query, ')'))
        return false;
    }
    return (query.replaceAll('(','').replaceAll(')','').match(/^(\ *([cekrst]:\ *([^%/\\\?():<>="\ ]+|"[^%/\\\?():<>="]+")|[mah][:<>=]\={0,1}\ *\d+|[^%/\\\?():<>="\ ]+|OR|u:\ *(t(rue)?|f(alse)?))\ *)+$/gm));
  }

  const safeIncludes = (str:String, term) => {
    if(str===null || typeof str==='undefined') return false;
    return str.includes(term);
  }

  return (
    <div className='bg-blue-400 w-screen h-screen space-y-4'>
      <div className='w-full h-auto flex justify-center'>
        <div className="flex mt-72 p-1 w-screen md:w-3/6 bg-white rounded-md  shadow-sm border-2 placeholder-gray-400 border-blue-500 focus:ring-blue-700 focus:border-blue-700">
          <input 
            className="px-3 py-2 w-11/12 focus:outline-none"
            onChange={ (e)=>{setQuery(e.target.value)} }
          />
          <div
            className='w-4 flex items-center cursor-pointer md:pl-2 lg:pl-4'
            onClick={ ()=>{router.push(`/search/${query}`)} }
          >
            <FontAwesomeIcon 
              icon={faSearch}
            />
          </div>
        </div>
      </div>
      <div className={
        classNames({
          'flex justify-center':true,
          'h-14': searchIsValid() && !safeIncludes(query,'(')
        })
      }>
        {(!searchIsValid() || safeIncludes(query, '(' ) ) && (
          <div className={
            classNames({
              'flex justify-around text-white w-screen rounded-md px-2 py-1 md:w-3/6':true,
              'bg-red-500 mb-6':!searchIsValid(),
              'bg-yellow-400': searchIsValid() && safeIncludes(query,'(')
            })
          }>
            {!searchIsValid() ?
              "ERROR: Your search has a problem in its formatting." : 
              "WARNING: Validation with Parentheses is still being worked on. Your query will probably work, but we cannot check at this moment."
            }
          </div>
        )}
      </div>
      <div className='flex justify-center'>
        <div className='flex justify-around w-screen md:w-3/6'>
            <Button text='Syntax Guide' onClick={ ()=>{ 
              window.open('/syntax-guide','_blank')
            }}/>
            <Button text='Random Card' onClick={ ()=>{ 
              if(query!==null && typeof query!=='undefined')
                router.push(`random/${query}`)
              else
                router.push(`/random/`)
            }}/>
            <Button text='Discover' onClick={ ()=>{
              if(query!==null && typeof query!=='undefined')
                router.push(`/discover/${query}`)
              else
                router.push(`/discover/`)
            }}/>
            <Button text='Search' onClick={ ()=>{
              if(query!==null && typeof query!=='undefined')
                router.push(`/search/${query}`)
              else
                router.push(`/search/`)
            }}/>
        </div>
      </div>
    </div>
  )
}

export default FullPageSearch;