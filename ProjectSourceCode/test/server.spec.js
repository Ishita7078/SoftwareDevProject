const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index'); 
const should = chai.should();

chai.use(chaiHttp);
const { expect } = chai;
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