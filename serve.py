#!/usr/bin/env python3
import os, sys, http.server, socketserver

DIR = os.path.dirname(os.path.abspath(__file__))
os.chdir(DIR)

class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

PORT = 8765
with socketserver.TCPServer(("127.0.0.1", PORT), Handler) as httpd:
    print(f"serving {DIR} at http://127.0.0.1:{PORT}", flush=True)
    httpd.serve_forever()
