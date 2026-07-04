#!/usr/bin/env python3
"""Lokaler Starter für die Katzengesundheits-App.

Startet einen kleinen lokalen Webserver (nur auf diesem Rechner erreichbar)
und oeffnet die App im Standardbrowser. So funktioniert localStorage zuverlaessig
ueber http://localhost statt ueber file://.

Beenden: dieses Fenster schliessen oder Strg+C druecken.
"""
import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 8770
DIRECTORY = os.path.dirname(os.path.abspath(__file__))


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def log_message(self, *args):
        pass  # keine Server-Logs im Fenster


def find_free_port(start):
    import socket
    port = start
    for _ in range(20):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            if s.connect_ex(("127.0.0.1", port)) != 0:
                return port
        port += 1
    return start


def main():
    port = find_free_port(PORT)
    url = f"http://localhost:{port}/index.html"
    print("=" * 52)
    print("  Katzengesundheit  -  laeuft komplett lokal")
    print("=" * 52)
    print(f"  Adresse : {url}")
    print("  Beenden : dieses Fenster schliessen (oder Strg+C)")
    print("=" * 52)
    try:
        webbrowser.open(url)
    except Exception:
        print("  Bitte oeffne die Adresse manuell im Browser.")

    with socketserver.TCPServer(("127.0.0.1", port), Handler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n  Beendet. Bis bald!")
            sys.exit(0)


if __name__ == "__main__":
    main()
