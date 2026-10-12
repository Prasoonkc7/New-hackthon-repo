# Migrations

The MVP initializes tables with `db.create_all()` on startup. For production,
install Flask-Migrate and replace this bootstrap with versioned migrations.
The `migrations` directory is reserved for that upgrade and is intentionally
kept in source control.
