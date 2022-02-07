# The server should log all transmitted data into a CSV format (?) and
# prepare incoming data to be sent via a HTTP response (or maybe socket connection?)
from http.server import HTTPServer, BaseHTTPRequestHandler, SimpleHTTPRequestHandler
from threading import Thread # if threading is too slow can switch to using multiprocessing
from live_data import serial_connect
from io import BufferedIOBase
import queue

data_q = queue.SimpleQueue() # shared thread resource

# TODO: look into https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API as a replacement it http connection
class LiveDataRequestHandler(SimpleHTTPRequestHandler):
    
    def do_GET(self):
        if self.path == '/':
            self.path = '/live_data/index.html'
        if self.path != '/get_data':
            return SimpleHTTPRequestHandler.do_GET(self) # https://stackabuse.com/serving-files-with-pythons-simplehttpserver-module/
        
        self.send_response(200)
        self.end_headers()
        # Use of qsize here should be reliable in not overestimating the size of the queue as
        # this thread only consumes (.get()), and the other thread only produces (.put()).
        # Might be a problem if this server is able to allow multiple requests threaded at once -- have to check on that.
        size = data_q.qsize()
        out_data = bytes()
        while size > 0:
            out_data += bytes(data_q.get_nowait()) # this can maybe be improved with a buffer/stream
            size -= 1
        self.wfile.write(out_data)

httpd = HTTPServer(('localhost', 8000), LiveDataRequestHandler)
server_thread = Thread(target=httpd.serve_forever, daemon=True) # TODO: have it close server resources more gracefully?
server_thread.start()
serial_connect.start_port_listening(data_q)
