# Use the official PostgreSQL image
FROM postgres:14

# Set environment variables
ENV POSTGRES_DB=db
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres

# Expose the PostgreSQL port
EXPOSE 5432
