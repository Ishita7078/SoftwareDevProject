# SoftwareDevProject
## Brief Application description <img src="https://github.com/Ishita7078/SoftwareDevProject/blob/main/ProjectSourceCode/public/img/logo.png?raw=true" alt="Logo" width="30"/> :
**Whiteboard** is a dynamic collaborative platform that allows users to manage group progress more easily. The goal of the Whiteboard is to offer a variety of features dedicated to making project management more visual, intuitive, and centralized. 

**Features include:**
There is an interactive “whiteboard” where individuals can write on “sticky notes” to brainstorm and problem-solve. There is a calendar where users can keep track of their meetings as tasks. There will be a pipeline where you can track progress and todos to see how close you are to your goal. Users can add and remove group members, and designate roles (admins or not) to users. There will also be an area to store project files. This feature was created to allow for a central space for teams to store their work.

## Link to the deployed application
[Whiteboard](https://softwaredevproject.onrender.com/login)

## Wireframes
[Wireframes](https://www.figma.com/design/o46v9QcsQwwiOx9YTqcaM7/Whiteboard-Wireframe?node-id=0-1&node-type=canvas)

## Technology Stack used for the project

- **Project Tracker**: GitHub Project Board – used for task management and project progress tracking.
- **Version Control System (VCS)**: GitHub – to store code and manage version control.
- **Database**: PostgreSQL – relational database used for storing and managing data.
- **UI Tools**: 
  - **Figma** – for designing the user interface.
  - **HandleBars** – for template management.
  - **Bootstrap** – for responsive design and styling.
- **Integrated Development Environment (IDE)**: VS Code – primary IDE used for development.
- **Application Server**: Node.js – for server-side scripting and handling application logic.
- **File Upload Management**: Multer – for handling file uploads within the application.
- **Deployment Environment**: Render – for hosting and deploying the application.
- **Testing Tools**: 
  - **Mocha** – for writing test cases.
  - **Chai** – for assertions in tests.
- **Framework**: Express (in Node.js) – for building the server-side application.
- **Primary Methodology**: Agile – followed an iterative and incremental development approach.


## Instructions on how to run the application locally:
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
## Project Tracker
You can track the progress of this project through the Project Tracker:  
[View Project Board](https://github.com/users/Ishita7078/projects/1/views/1)
## Project Tracker Screenshot
![Project Tracker Screenshot](https://github.com/Ishita7078/SoftwareDevProject/blob/main/ProjectSourceCode/public/img/tracker.png?raw=true)

## How to Run the Tests

This project uses **Mocha** and **Chai** as the testing libraries to validate server-side endpoints and application logic.

Make sure you have **Node.js** installed on your machine. Before running the tests, ensure that all required dependencies are installed by running:

```bash
npm install
```
Once the dependencies are installed, you can execute the tests with:

```bash
npm test
```
Test files are located in the ProjectSourceCode/test/server.spec.js

The testing dependencies include Mocha, Chai, and Chai-HTTP, which you can install using:
```bash
npm install mocha chai chai-http --save-dev
```

Ensure that the package.json has the following script defined under scripts:
```bash
{
  "scripts": {
    "test": "mocha ./src/test/server.spec.js"
  }
}
```
After setting this up, running:

```bash
npm test
```
will execute the test.


## Use Case Diagram
![Use Case diagram](https://raw.githubusercontent.com/Ishita7078/SoftwareDevProject/3d4b989597ec5b84b4fa49f10102d31e28d2a33e/ProjectSourceCode/public/img/use%20case.png)



