function MYajax(method,url,param,callback) {
    var xhr;
    if(XMLHttpRequest) {
        xhr = new XMLHttpRequest()
    }else{
        xhr = new ActiveXObject('Microsoft.XMLHttp')
    }
    if(method.toLowerCase()=='get') {
        url = url+'?'+param
    }
    xhr.open(method,url,true)
    xhr.onreadystatechange=function() {
        if(xhr.readyState==4&&xhr.status==200) {
            callback(xhr.responseText)
        }
    }
    if(method.toLowerCase()=='post'){
        xhr.setRequestHeader('content-type','application/x-www-form-urlencoded');
        xhr.send(param)
    }
    xhr.send()
}