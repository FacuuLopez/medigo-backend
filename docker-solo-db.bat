docker run --name medigo_base -p 5432:5432 -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=admin -e POSTGRES_DB=medigo --health-interval=5s --health-timeout=5s -d postgres:latest
