

class RestClient {

    getXHR(){
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        return xhr;
    }
    get(url, callback) {
        var xhr = this.getXHR();
        xhr.open("GET",  url, true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");        
        xhr.onreadystatechange = function () {
            if (this.readyState == this.DONE) {
                var data = JSON.parse(xhr.responseText)
                callback(data)
            }
        }
        xhr.send();
    }


    post(url, obj, callback) {
        var xhr = this.getXHR()
        xhr.open("POST",  url, true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");        
        xhr.onreadystatechange = function () {
            if (this.readyState == this.DONE) {
                var data = JSON.parse(xhr.responseText)
                callback(data)
            }
        }
        xhr.send(JSON.stringify(obj));

    }

    put(url, obj, callback) {
        var xhr = this.getXHR();
        xhr.open("PUT", url, true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");        
        xhr.onreadystatechange = function () {
            if (this.readyState == this.DONE) {
                var data = JSON.parse(xhr.responseText)
                callback(data)
            }
        }
        xhr.send(JSON.stringify(obj));
    }

    delete(url, callback) {
        var xhr = this.getXHR();
        xhr.open("DELETE", url, true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");                
        xhr.onreadystatechange = function () {
            if (this.readyState == this.DONE) {
                var data = JSON.parse(xhr.responseText)
                callback(data)
            }
        }
        xhr.send();
    }

}


export default RestClient;


