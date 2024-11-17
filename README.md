# SoftwareDevProject
## Brief Application description
## Contributors - In this case, it will be the team Members
## Technology Stack used for the project
## Prerequisites to run the application - Any software that needs to be installed to run the application
## Instructions on how to run the application locally.
# Project Setup

Follow these steps to set up and run the project locally:

1. **Clone the Repository**  
   First, clone the repository to your local machine:
   ```bash
   git clone <repository-url>
   ```

2. **Create the `.env` File**  
   Navigate to the `projectSource code` folder and create a `.env` file with the following contents:
   ```plaintext
   # Database credentials
   POSTGRES_USER="postgres"
   POSTGRES_PASSWORD="pwd"
   POSTGRES_DB="users_db"

   # Node vars
   SESSION_SECRET="super duper secret!"
   API_KEY="<TODO: Replace with your Ticketmaster API key if you are using lab 8 as a base>"
   ```
   
3. **Run Docker**  
   In your terminal, navigate to the project folder
   ```bash
         cd /SoftwareDevProject/ProjectSourceCode
    ```

    Run the following command to start the containers:
   ```bash
   docker compose up -d
   ```

Your setup is complete! The project should now be running.EY="<TODO: Replace with your Ticketmaster API key if you are using lab 8 as a base>"

## How to run the tests
## Link to the deployed application
