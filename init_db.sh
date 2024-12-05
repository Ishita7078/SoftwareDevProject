#!/bin/bash

# DO NOT PUSH THIS FILE TO GITHUB
# This file contains sensitive information and should be kept private

# TODO: Set your PostgreSQL URI - Use the External Database URL from the Render dashboard
PG_URI="postgresql://postgress:VGrPSGJGrjcZiwdSmJIML7QgMlLecaZM@dpg-ct0ctepu0jms73dorj9g-a.oregon-postgres.render.com/users_db_gw6r"

# Execute each .sql file in the directory
for file in ProjectSourceCode/init_data/*.sql; do
    echo "Executing $file..."
    psql $PG_URI -f "$file"
done