// ********************** Initialize server **********************************
const server = require('../index'); 
// ********************** Import Libraries ***********************************
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);
const {assert, expect}=chai;

// ********************** WRITE TESTCASE ****************************
// Example Positive Testcase :
// API: /add_user
// Input: {id: 5, name: 'John Doe', dob: '2020-02-20'}
// Expect: res.status == 200 and res.body.message == 'Success'
// Result: This test case should pass and return a status 200 along with a "Success" message.
// Explanation: The testcase will call the /add_user API with the following input
// and expects the API to return a status of 200 along with the "Success" message.

describe('Testing Add User API', () => {
    it('positive : /add_user', done => {
      chai
        .request(server)
        .post('/add_user')
        .send({id: 5, name: 'John Doe', dob: '2020-02-20'})
        .end((err, res) => {
          expect(res).to.have.status(200);
          // expect(res.body.message).to.equals('Success');
          done();
        });
    });

  it('negative : /add_user - missing name', done => {
    chai
      .request(server)
      .post('/add_user')
      .send({ id: 5, dob: '2020-02-20' }) //missing 'name'
      .end((err, res) => {
        expect(res).to.have.status(400); 
        done();
      });
  });
});


  //positive test case
describe('Testing Register API', () => {
    // Positive test case: Valid registration
    it('should register a user successfully with valid input', (done) => {
        chai.request(server)
            .post('/register')
            .send({
                email: 'testuser@example.com',
                username: 'testuser',
                password: 'ValidPassword123',
                name: 'john',
            })
            .end((err, res) => {
                res.should.have.status(200); // Expecting status code 200 for success
                // res.body.message.should.equal('User registered successfully'); // Adjust message as per your API response
                done();
            });
    });
});
//negative test case

describe('Testing Register API', () => {
  // Negative test case: Invalid registration (e.g., missing password)
  it('should return an error for invalid registration input', (done) => {
      chai.request(server)
          .post('/register')
          .send({
              email: 'invaliduser@example.com',
              username: 'invaliduser'
              // Missing 'password' field
          })
          .end((err, res) => {
              res.should.have.status(400); // Expecting status code 400 for invalid input
              // res.body.message.should.equal('Password is required'); // Adjust message as per your API response
              done();
          });
  });
});


// --------------------Testing Login API----------------------------
describe('Login API Tests', () => {
  it('should return 200 for valid credentials', (done) => {
      chai.request(server)
          .post('/login') // Replace with your login API route
          .send({ username: 'testuser', password: 'testpass' })
          .end((err, res) => {
              res.should.have.status(200);
              res.body.should.have.property('token');
              done();
          });
  });

  it('should return 401 for invalid credentials', (done) => {
      chai.request(server)
          .post('/login')
          .send({ username: 'wronguser', password: 'wrongpass' })
          .end((err, res) => {
              res.should.have.status(401);
              res.body.should.have.property('error').eql('Unauthorized');
              done();
          });
  });
});

// --------------------Testing Redirect ----------------------------
describe('Testing Redirect', () => {
  // Sample test case given to test /test endpoint.
  it('\test route should redirect to /login with 302 HTTP status code', done => {
    chai
      .request(server)
      .get('/')
      .end((err, res) => {
        res.should.have.status(302); // Expecting a redirect status code
        res.should.redirectTo(/^.*127\.0\.0\.1.*\/login$/); // Expecting a redirect to /login with the mentioned Regex
        done();
      });
  });
});