import multiprocessing

workers = multiprocessing.cpu_count() * 2 + 1
threads = 4
worker_class = "gthread"
keepalive = 5
timeout = 30
preload_app = True
max_requests = 1000
max_requests_jitter = 100
accesslog = "-"
errorlog = "-"
loglevel = "info"
