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

app.get('/login', (req, res) => {
    res.render('pages/login', { isLoginPage: true });
  });

app.get('/login', (req, res) => {
  res.render('pages/login');
});
app.get('/register', (req, res) => {
  res.render('pages/register'); 
});

app.get('/project', (req, res) => {
  res.render('pages/project', { isLoginPage: false });
});

app.get('/whiteboard', (req, res) => {
  res.render('pages/whiteboard'); 
});

app.get('/overview', (req, res) => {
  res.render('pages/overview'); 
});
/*
//multer library for handling file uploads
const multer = require('multer'); 
//array to track details of uploaded files 
const uploadedFiles = []; 

//set up Multer for file uploads
const upload = multer({ dest: 'uploads/' }); // Files will be uploaded to the 'uploads/' directory

//route to handle file uploads
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    //If no file was uploaded, redirect the user back to the files page
    return res.redirect('/files');
  }

  //save uploaded file details 
  uploadedFiles.push({ 
    filename: req.file.originalname, //original name 
    path: req.file.path, //path where the file is stored 
  });

  //redirect to the files page after a successful upload
  res.redirect('/files');
});

//route to display the files page
app.get('/files', (req, res) => {
  res.render('pages/files', { uploadedFiles });
});
*/
//multer library for handling file uploads
const multer = require('multer'); 
//array to track details of uploaded files 
const uploadedFiles = []; 

//set up Multer for file uploads
const upload = multer({ dest: 'uploads/' }); // Files will be uploaded to the 'uploads/' directory

//route to handle file uploads
  app.post('/upload', upload.single('file'), (req, res) => {
    const { team_id, visibility } = req.body; //who has access to this file, (self or team)
    const uploader_id = req.user.id; //save uploader id
    const filePath = path.join(__dirname, 'uploads', req.file.filename);
    
    // default visibility is 'self' if no team_id is provided
      const fileVisibility = visibility || (team_id ? 'team' : 'self');
    // store data in DB
    db.query(
      `INSERT INTO files (file_name, file_path, uploader_id, team_id) VALUES (?, ?, ?, ?)`,
      [req.file.originalname, filePath, uploader_id, team_id|| null, fileVisibility],
      (err) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).send('Error saving file metadata.');
        }
        // Redirect to files page after a successful upload
        res.redirect('/files');
      }
    );
  });

//route to display the files page
app.get('/files', async (req, res) => {
  try {
    const user_id = req.session.user.id;
    const team_id = req.session.user.team_id; // get logged-in user's team_id

    // Query to get files based on visibility and team
    let query = 'SELECT * FROM files WHERE visibility = $1 OR (team_id = $2 AND visibility = $3)';
    let params = ['self', team_id, 'team'];

    // If the user is not in a team, they can only see their own files
    if (!team_id) {
      query = 'SELECT * FROM files WHERE visibility = $1 OR uploader_id = $2';
      params = ['self', user_id];
    }

    const results = await db.any(query, params); // Fetch files using pg-promise method

    // Render the files page and pass the results to the template
    
  } catch (err) {
    console.error('DB error:', err);
    res.status(500).send('Error retrieving files.');
  }
});


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

const auth = (req, res, next) => {
  const openRoutes = ['/login', '/register', '/logout'];
  if (openRoutes.includes(req.path)) {
    return next();
  }
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
};
app.use(auth);

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

module.exports = app;

const server = app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});

module.exports = server; 

// *****************************************************
// <!-- Section 5 : Start Server-->
// *****************************************************
// starting the server and keeping the connection open to listen for more requests
//app.listen(3000);
module.exports = app.listen(3000); 
console.log('Server is listening on port 3000');