import request from 'superagent';

function get_data(url, ok_func, fail_func){
  request.get(url)
    .end((err, res) => {
      if(res.ok){
        ok_func(res)
      }else{
        if(fail_func){
          fail_func(err, res)
        }else{
          console.log(`request ${url} fail, ${err}`)
        }
      }
    })
}


api_request.get = (url, ok_func, fail_func) => {
  request.get(url)
    .end((err, res) => {
      if(res.ok){
        ok_func(res)
      }else{
        if(fail_func){
          fail_func(err, res)
        }else{
          console.log(`request ${url} fail, ${err}`)
        }
      }
    })
}

api_request.post = (url, data, ok_func, fail_func) => {
  request.post(url)
    .set({'Content-Type': 'application/json'})
    .send(data)
    .end((err, res) => {
      if (res.ok) ok_func(res);
      else {
        if (fail_func) fail_func(err, res);
        else console.log(`request ${url} fail, ${err}`)
      }
    })
}

export {api_request}
