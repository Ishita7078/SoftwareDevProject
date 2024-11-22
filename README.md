# SoftwareDevProject
## Brief Application description <img src="./logo.png" alt="Logo" width="30"/> :
**Whiteboard** is a teamwork and collaboration platform designed to streamline group project management and enhance accountability. It introduces a visual approach to effectively manage progress with various dedicated features.


**Features include:**

1. An interactive whiteboard for brainstorming and problem-solving as a group, where everyone can view, edit, and discuss ideas.
2. A calendar where users can log availability, set deadlines, and plan events.
3. A progress-tracking pipeline with task lists to help the team stay on track toward their goals.
5. A project file storage area.
## Technology Stack used for the project
## Prerequisites to run the application - Any software that needs to be installed to run the application
## Instructions on how to run the application locally.
# Project Setup :gear:

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

Your setup is complete! The project should now be running.
## Contributors: 👨‍💻
| Name              | Email                        | GitHub Username |
|-------------------|------------------------------|-----------------|
| Ragan Lee         | ragan.lee@colorado.edu       | raaganl         |
| Sepehr Rezaei     | Sepehr.Rezaei@colorado.edu   | sepehrRez       |
| Alexander Nguyen  | alng6160@colorado.edu        | TheAlexN        |
| Quinn Turner      | quinn.turner@colorado.edu    | qturner390      |
| Ishita Mehta      | ishita.mehta@colorado.edu    | Ishita7078      |
| Deep Singh        | Prsi1503@colorado.edu        | Prsi1503        |
## How to run the tests
## Link to the deployed application
