try:
    import pymysql

    pymysql.install_as_MySQLdb()
except ImportError:
    # Nếu môi trường chưa cài PyMySQL, Django vẫn có thể chạy với SQLite fallback
    pass
