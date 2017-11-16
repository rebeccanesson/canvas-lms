import requests
import flask

app = flask.Flask(__name__)

endpoint = "https://canvas.brown.edu/api/v1/"
verbs = { 
    "GET":  requests.get, 
    "POST": requests.post,
    "PUT": requests.put,
    "PATCH": requests.patch,
    "DELETE": requests.delete,
}

# simple forwarding server
@app.route('/<path:fullpath>')
def catchall(fullpath):

    # dictionary of environmental variables
    environ = flask.request.environ

    query_string   = environ['QUERY_STRING']
    request_method = environ['REQUEST_METHOD']
    request_path   = environ['PATH_INFO']
    url_string = f'{endpoint}{request_path}?{query_string}'
    
    # send a request based on the method requested
    response = verbs[request_method](url_string)
    for i in response.__dict__:
        print(i, response.__dict__[i])
    print("\n"*10)

    for i in response.headers:
        print(i, response.headers[i])
    # allow cross domain requests
    resp = flask.Response(response.text)
    resp.headers['Access-Control-Allow-Origin'] = '*'
    resp.headers['Access-Control-Allow-Credentials'] = 'true'
    resp.headers['Access-Control-Allow-Headers'] = 'Link'
    resp.headers['Access-Control-Expose-Headers'] = 'Link'
    resp.headers["Link"] = response.headers.get("Link", "")

    return resp


app.run(debug=True, port=5000)