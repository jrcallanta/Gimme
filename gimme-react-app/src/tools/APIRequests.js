const PRINT_LOG = false;



export const makeGet = async (url) => {
  if(PRINT_LOG) console.log(`GET (${url})`)
  return fetch('/api/route' + url).then((res)=>res.json())
}


export const makePost = async (url, jsonObject) => {
  if(PRINT_LOG) console.log(`POST (${url})`)
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(jsonObject)
  };
  return fetch('/api/route' + url, options)
}


export const makePatch = async (url, jsonObject) => {
  if(PRINT_LOG) console.log(`PATCH (${url})`)
  const options = {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(jsonObject)
  };
  return fetch('/api/route' + url, options)
}


export const makeDelete = async (url, jsonObject) => {
  if(PRINT_LOG) console.log(`DELETE (${url})`)
  const options = {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(jsonObject)
  };
  return fetch('/api/route' + url, options)
}
