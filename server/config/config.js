export class Config {
    constructor(host, user, password, db, dialect, pool) {
        this.host = host;
        this.user = user;
        this.password = password;
        this.db = db;
        this.dialect = dialect;
        this.pool = pool;
    }
}