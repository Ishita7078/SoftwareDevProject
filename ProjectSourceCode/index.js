// *****************************************************
// <!-- Section 1 : Import Dependencies -->
// *****************************************************

const express = require('express'); // To build an application server or API
const app = express();
const handlebars = require('express-handlebars');
const Handlebars = require('handlebars');
const path = require('path');
const pgp = require('pg-promise')(); // To connect to the Postgres DB from the node server
const bodyParser = require('body-parser');
const session = require('express-session'); // To set the session object. To store or access session data, use the `req.session`, which is (generally) serialized as JSON by the store.
const bcrypt = require('bcryptjs'); //  To hash passwords
const axios = require('axios'); // To make HTTP requests from our server. We'll learn more about it in Part C.

// *****************************************************
// <!-- Section 2 : Connect to DB -->
// *****************************************************
app.use(express.static(__dirname + '/public')); //allows express to access local css, javascript, etc in public file

// create `ExpressHandlebars` instance and configure the layouts and partials dir.
const hbs = handlebars.create({
  extname: 'hbs',
  layoutsDir: __dirname + '/views/layouts',
  partialsDir: __dirname + '/views/partials',
});

// database configuration
const dbConfig = {
  host: 'db', // the database server
  port: 5432, // the database port
  database: process.env.POSTGRES_DB, // the database name
  user: process.env.POSTGRES_USER, // the user account to connect with
  password: process.env.POSTGRES_PASSWORD, // the password of the user account
};

const db = pgp(dbConfig);

// test your database
db.connect()
  .then(obj => {
    console.log('Database connection successful'); // you can view this message in the docker compose logs
    obj.done(); // success, release the connection;
  })
  .catch(error => {
    console.log('ERROR:', error.message || error);
  });

// *****************************************************
// <!-- Section 3 : App Settings -->
// *****************************************************

// Register `hbs` as our view engine using its bound `engine()` function.
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.json()); // specify the usage of JSON for parsing request body.

// initialize session variables
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
  })
);

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// *****************************************************
// <!-- Section 4 : API Routes -->
// *****************************************************


// redirect to login page 
app.get('/', (req, res)=>{
  res.redirect('/login') 
  });

app.get('/login', (req, res) => {
  res.render('pages/login');
});
app.get('/register', (req, res) => {
  res.render('pages/register'); 
});

app.get('/project', (req, res) => {
  res.render('pages/project'); 
});

app.get('/whiteboard', (req, res) => {
  res.render('pages/whiteboard'); 
});


//---------------------multer library for handling file uploads-----------------------
const multer = require('multer'); 
//array to track details of uploaded files 
// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: (req, file, cb) => {
    // Use the original name of the file
    cb(null, file.originalname);
  }
});
const uploadedFiles = []; 

//set up Multer for file uploads
const upload = multer({ storage }); // Files will be uploaded to the 'uploads/' directory

//r---------------------oute to handle file uploads------------------------------
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.redirect('/files');
      }
  
      const uploader_id = req.session.user.username;
      const visibility = req.body.visibility === 'team' ? 'team' :'self';
  
      // query to find user's team
      const teamQuery = `
        SELECT t.team_id
        FROM teams t
        JOIN team_members tm ON t.team_id = tm.team_id
        WHERE tm.username = $1`;
      const userTeam = await db.oneOrNone(teamQuery, [uploader_id]);
      const team_id = userTeam ? userTeam.team_id : null;
  
    // Prevent setting visibility to 'team' if user is not part of any team
      if (visibility === 'team' && !team_id) {
        return res.status(400).send('You are not part of a team and cannot set visibility to "team".');
      }
      const filePath = path.join(__dirname, 'uploads', req.file.filename);
  
      // store file inf in DB
      await db.none(
        `INSERT INTO files (file_name, file_path, uploader_username, team_id, visibility) 
        VALUES ($1, $2, $3, $4, $5)`,
        [req.file.originalname, filePath, uploader_id, team_id, visibility]
      );
  
      res.redirect('/files');
    } catch (err) {
      console.error('Upload error:', err);
      res.status(500).send('Error uploading the file.');
    }
  });
  

//--------------------route to display the files page------------------------
app.get('/files', async (req, res) => {
  try {
    const username = req.session.user.username;

    // query to find user's team
    const teamQuery = `
      SELECT t.team_id
      FROM teams t
      JOIN team_members tm ON t.team_id = tm.team_id
      WHERE tm.username = $1`;
    const userTeam = await db.oneOrNone(teamQuery, [username]);//each user can be membar of 0/1 group

    // find visible files
    const filesQuery = userTeam
      ? `SELECT * FROM files WHERE (visibility = 'self' AND uploader_username = $1)
                                    OR (team_id = $2 AND visibility = 'team')`
      : `SELECT * FROM files WHERE visibility = 'self' AND uploader_username = $1`;

    const params = userTeam ? [username, userTeam.team_id] : [username];
    const uploadedFiles = await db.any(filesQuery, params);

    res.render('pages/files', { uploadedFiles });
  } catch (err) {
    console.error('DB error:', err);
    res.status(500).send('Error retrieving files.');
  }
});
//--------------------route to show uploaded files ------------------------
const fs = require('fs');
app.get('/files/:filename', (req, res) => {
  const fileName = req.params.filename;

  // Sanitize filename to prevent directory traversal
  const sanitizedFileName = path.basename(fileName);

  // Define the file's path in the uploads directory
  const filePath = path.join(__dirname, 'uploads', sanitizedFileName);

  // Check if the file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error('File not found:', filePath);
      return res.status(404).send('File not found.');
    }

    // Send the file to the client for download
    res.download(filePath, sanitizedFileName, (err) => {
      if (err) {
        console.error('Error during file download:', err);
        return res.status(500).send('An error occurred while downloading the file.');
      }
    });
  });
});
//--------------------route to Delete a uploaded file ------------------------
app.post('/delete-file/:id', async(req, res) => {
  try{
    const file_id= req.params.id;
    const username=req.session.user.username;

    //check if the user is the Owener of file
    const file = await db.oneOrNone(
      'SELECT * FROM files WHERE file_id= $1  AND uploader_username=$2',
      [file_id, username]
    );

    if(!file){
      return res.status(403).send('You are Not authorized to delete this file.');
    }
    //Delete the file record from DB
    await db.none('DELETE FROM files WHERE file_id= $1', [file_id]);
    
    //Delete the file from Server
    const file_path=path.join(__dirname,'uploads', file.file_path);
    fs.unlink(file_path, (err) =>{
      if (err) console.error('File Deletation Err', err);
    });

    res.redirect('/files');
  } catch (err){
    console.error('Error during Deleteing', err);
    return res.status(500).send('An Error occured while Deleteing the File');
  }
});

// --------------------route to handle editing a file ------------------------
app.post('/edit-file/:id', async (req, res) => {
  try {
    const file_id = req.params.id;
    const username = req.session.user.username;
    const newVisibility = req.body.visibility;  // New visibility

    if (!newVisibility) {
      return res.status(400).send('Visibility is required.');
    }
    // check if the user is owner of the files
    const file = await db.oneOrNone(
      'SELECT * FROM files WHERE file_id = $1 AND uploader_username = $2',
      [file_id, username]
    );

    if (!file) {
      return res.status(403).send('You are not authorized to edit this file.');
    }
  //check wheather the user is a part of team or not 
  if (newVisibility === 'team') {
    const userTeam = await db.oneOrNone(
      `
      SELECT t.team_id 
      FROM teams t 
      JOIN team_members tm ON t.team_id = tm.team_id 
      WHERE tm.username = $1
      `,
      [username]
    );

    if (!userTeam) {
      return res.status(400).send('You are not part of a team and cannot set visibility to "team".');
    }

    // if the user is a teammmember then change the visibiity
    await db.none(
      'UPDATE files SET visibility = $1, team_id = $2 WHERE file_id = $3',
      [newVisibility, userTeam.team_id, file_id]
    );
  } else {
    await db.none(
      'UPDATE files SET visibility = $1, team_id = NULL WHERE file_id = $2',
      [newVisibility, file_id]
    );
  }
    res.redirect('/files');
  } catch (err) {
    console.error('Error during file edit:', err);
    return res.status(500).send('An error occurred while editing the file.');
  }
});



//------------------------------------ Routs for Register.hbs  ----------------------------------------------------
app.post('/register', async (req, res) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    const usern = req.body.username;
    const name = req.body.name;
    const email = req.body.email;
    const gender = req.body.gender;
    const age = parseInt(req.body.age, 10)

    console.log("Registering user with data:", { usern, hash, name, email, gender, age });

    //insert user into the database
    const insertUser = `
      INSERT INTO users (username, password, name, email, gender, age)
      VALUES ($1, $2, $3, $4, $5, $6);
    `;
    await db.none(insertUser, [usern, hash, name, email, gender, age]);

    res.redirect('/login');
  } catch (err) {
    console.error("Error during registration:", err);
    res.redirect('/register');
  }
});


// -------------------------------------  ROUTES for login.hbs   ----------------------------------------------
app.post('/login', async (req, res) => {
  // define username and password
  const username = req.body.username;
  const password = req.body.password;

  // finding user in database 
  const findUser = `SELECT * FROM users WHERE username = $1`;
  const user = await db.oneOrNone(findUser, [username]).catch(error => {
    console.error('Error finding user:', message);
    res.render('pages/login', { message: 'An error occurred during login. Please try again.' });
    return;
  });

   // if user not found redirect to register page
   if (!user) {
    return res.redirect('/register');
  }

   // if user has been found --> Compare password with the hashed password, .trim() removes excess whitespace
  const match = await bcrypt.compare(password, user.password.trim()).catch(error => { 
    console.error('Error comparing passwords:', error);
    res.render('pages/login', { message: 'An error occurred during login.' });
    return;
  });

console.log('Password chars:', [...password].map(c => c.charCodeAt(0)));
console.log('User password chars:', [...user.password].map(c => c.charCodeAt(0)));

  console.log('Plain password:', password);
  console.log('password:', user.password);
  console.log('match:', match);

  //reload login page if username or password dosen't match
  if (!match) {
    return res.render('pages/login', { message: 'Incorrect username or password.' });
  }

  // Save user informations in the session
  req.session.user = user;
  await req.session.save();

  // redirect to home page when user has successfully loged in
  res.redirect('/project');
});

// Authentication Middleware.
const auth = (req, res, next) => {
  if (!req.session.user) {
    // Default to login page.
    return res.redirect('/login');
  }
  next();
};
// Authentication Required
app.use(auth);

// ------------------------------------- ROUTES for edit.hbs ------------------------------------------------

// Route that displays the edit profile form
app.get('/edit', async (req, res) => {
  try{
    const username = req.session.user.username;
    const findUser = `SELECT username, name, email, gender, age FROM users WHERE username = $1`;
    const user = await db.one(findUser, [username]);
    res.render('pages/edit', { user })
  } catch (err) {
    console.error('Error fetching user data:', err);
    res.render('pages/edit', { message: 'An error occurred while fetching user data.'});
  }
});

// Route to handle  form submission
app.post('/edit', async (req, res) =>{
  try {
    const username = req.session.user.username;
    const {name, email, gender, age} = req.body;

    const updateUser = `
      UPDATE users
      SET name = $1, email = $2, gender = $3, age = $4
      WHERE username = $5`;
    await db.none(updateUser, [name, email, gender, age, username]);

    // Update session user object
    req.session.user.name = name;
    req.session.user.email = email;
    req.session.user.gender = gender;
    req.session.user.age = age;
    await req.session.save();

    res.redirect('/login');
  } catch (err) {
    console.error('Error updating user data:', err);
    res.render('pages/edit', {message: 'An error occurred while updating your profile.'});
  }
});

// -------------------------------------  ROUTES for logout.hbs   ----------------------------------------------

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    // Render the logout
    res.render('pages/logout', { message: 'Logged out Successfully' });
  });
});

//------------------------------------ Routes for teams.hbs  ----------------------------------------------------
app.get('/teams', async (req, res) => {
  try {
    const username = req.session.user.username;

    // Get all teams the user is a member of
    const teamsQuery = `
      SELECT t.team_id, t.team_name
      FROM teams t
      JOIN team_members tm ON t.team_id = tm.team_id
      WHERE tm.username = $1
    `;
    const teams = await db.any(teamsQuery, [username]);

    // For each team, get its members
    for (let team of teams) {
      const membersQuery = `
        SELECT u.username, u.name, u.email, tm.role
        FROM users u
        JOIN team_members tm ON u.username = tm.username
        WHERE tm.team_id = $1
      `;
      const members = await db.any(membersQuery, [team.team_id]);
      team.members = members;
    }

    res.render('pages/teams', { teams });
  } catch (err) {
    console.error('Error fetching teams:', err);
    res.render('pages/teams', { message: 'An error occurred while fetching teams.' });
  }
});


//------------------------------------ Routes for manage_team.hbs  ----------------------------------------------------
app.get('/manage-team', async (req, res) => {
  try {
    const username = req.session.user.username;

    // Get teams where the user is an admin
    const adminTeamsQuery = `
      SELECT t.team_id, t.team_name
      FROM teams t
      JOIN team_members tm ON t.team_id = tm.team_id
      WHERE tm.username = $1 AND tm.role = 'admin'
    `;
    const adminTeams = await db.any(adminTeamsQuery, [username]);

    // Get teams where the user is a member
    const memberTeamsQuery = `
      SELECT t.team_id, t.team_name
      FROM teams t
      JOIN team_members tm ON t.team_id = tm.team_id
      WHERE tm.username = $1 AND tm.role = 'member'
    `;
    const memberTeams = await db.any(memberTeamsQuery, [username]);

    res.render('pages/manage_team', { adminTeams, memberTeams });
  } catch (err) {
    console.error('Error fetching manage teams:', err);
    res.render('pages/manage_team', { message: 'An error occurred while fetching manage teams.' });
  }
});

app.post('/create-team', async (req, res) => {
  try {
    const username = req.session.user.username;
    const team_name = req.body.team_name;

    // Check if user is already in a team
    const userTeam = await db.oneOrNone(
      'SELECT team_id FROM team_members WHERE username = $1',
      [username]
    );

    if (userTeam) {
      // User is already on a team, fetch teams to display them again
      const adminTeamsQuery = `
        SELECT t.team_id, t.team_name
        FROM teams t
        JOIN team_members tm ON t.team_id = tm.team_id
        WHERE tm.username = $1 AND tm.role = 'admin'
      `;
      const memberTeamsQuery = `
        SELECT t.team_id, t.team_name
        FROM teams t
        JOIN team_members tm ON t.team_id = tm.team_id
        WHERE tm.username = $1 AND tm.role = 'member'
      `;
      const adminTeams = await db.any(adminTeamsQuery, [username]);
      const memberTeams = await db.any(memberTeamsQuery, [username]);

      return res.render('pages/manage_team', {
        message: 'You are already on a team and cannot create a new one.',
        adminTeams,
        memberTeams
      });
    }

    // User not on a team, create a new team
    const { team_id } = await db.one(
      'INSERT INTO teams (team_name) VALUES ($1) RETURNING team_id',
      [team_name]
    );

    // Add user as admin
    await db.none(
      'INSERT INTO team_members (username, team_id, role) VALUES ($1, $2, \'admin\')',
      [username, team_id]
    );

    // Redirect to /manage-team so it refetches and shows the new team immediately
    res.redirect('/manage-team');
  } catch (err) {
    console.error('Error creating team:', err);
    // If there's an error, just redirect to /manage-team
    // (You can also handle errors more gracefully if desired)
    res.redirect('/manage-team');
  }
});

app.post('/add-member', async (req, res) => {
  try {
    const team_id = req.body.team_id;
    const member_username = req.body.username;
    const username = req.session.user.username;

    // Check if the current user is admin of the team
    const adminCheckQuery = `
      SELECT role FROM team_members
      WHERE team_id = $1 AND username = $2
    `;
    const result = await db.one(adminCheckQuery, [team_id, username]);

    if (result.role !== 'admin') {
      // Not authorized
      return res.redirect('/manage-team');
    }

    // Check if the user to be added exists
    const userCheckQuery = `
      SELECT username FROM users WHERE username = $1
    `;
    const userExists = await db.oneOrNone(userCheckQuery, [member_username]);

    if (!userExists) {
      // User does not exist
      return res.redirect('/manage-team');
    }

    // Add member to team_members
    const insertMemberQuery = `
      INSERT INTO team_members (team_id, username, role)
      VALUES ($1, $2, 'member')
      ON CONFLICT DO NOTHING
    `;
    await db.none(insertMemberQuery, [team_id, member_username]);

    res.redirect('/manage-team');
  } catch (err) {
    console.error('Error adding member:', err);
    res.redirect('/manage-team');
  }
});

app.post('/remove-member', async (req, res) => {
  try {
    const team_id = req.body.team_id;
    const member_username = req.body.username;
    const username = req.session.user.username;

    // Check if the current user is admin of the team
    const adminCheckQuery = `
      SELECT role FROM team_members
      WHERE team_id = $1 AND username = $2
    `;
    const result = await db.one(adminCheckQuery, [team_id, username]);

    if (result.role !== 'admin') {
      // Not authorized
      return res.redirect('/manage-team');
    }

    // Remove member from team_members
    const deleteMemberQuery = `
      DELETE FROM team_members
      WHERE team_id = $1 AND username = $2
    `;
    await db.none(deleteMemberQuery, [team_id, member_username]);

    res.redirect('/manage-team');
  } catch (err) {
    console.error('Error removing member:', err);
    res.redirect('/manage-team');
  }
});

app.post('/leave-team', async (req, res) => {
  try {
    const team_id = req.body.team_id;
    const username = req.session.user.username;

    // Remove user from team_members
    const deleteMemberQuery = `
      DELETE FROM team_members
      WHERE team_id = $1 AND username = $2
    `;
    await db.none(deleteMemberQuery, [team_id, username]);

    res.redirect('/manage-team');
  } catch (err) {
    console.error('Error leaving team:', err);
    res.redirect('/manage-team');
  }
});

// ------- overview page routes ---------------------
const todos = `
  SELECT
  todo_id,
  todo_title,
  todo_date,
  todo_username,
  team_id,
  todo_completed
  FROM todos;`;

const announcement = `
  SELECT
  team_announcement
  FROM teams WHERE team_id = 1;`;

db.any(todos)
.then(todos => {
    app.get('/overview', (req, res) => {
      res.render('pages/overview', {
        todos,
      });
  });
})


db.task('get-everything', task => {
  return task.batch([
    task.any(todos), //query 1
    task.any(announcement), //query 2
  ]);
})
  .then(data => {
    app.get('/overview', (req, res) => {
      res.render('pages/overview', {
        todos: data[0],
        announcement: data[1],
      });
  });
  })
  .catch(err => {
    // throw error;
  });


// --------------------  this commmented lines broke my code ---------------
//module.exports = app;

//----- calendar -------

app.get('/calendar', (req, res) => {
  res.render('pages/calendar', { layout: 'main', title: 'Calendar' });
});


// *****************************************************
// <!-- Section 5 : Start Server-->
// *****************************************************
// starting the server and keeping the connection open to listen for more requests
//app.listen(3000);
module.exports = app.listen(3000); 
console.log('Server is listening on port 3000');