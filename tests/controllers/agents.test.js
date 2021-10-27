describe('Controllers test', () => {
  let boot; let
    shutdown;
  before(() => {
    boot = require('../../server').boot;
  });

  describe('POST /api/v1/register/agent', () => {
    it('It should create a new agent in the DB', (done) => {
      const user = {
        email: 'adefemi101@gmail.com',
        password: '123456abc',
        first_name: 'kelvin',
        last_name: 'Akpobome',
        password: '123456',
        username: 'kelvin',
        address: '12 abcd',
        verification_token: '1234567',
        role: 'Agent',
        status: '1',
        block: false,
        post_id: [
          '1',
          '2',
        ],
      };

      chai
        .request(boot)
        .post('/api/v1/register/agent')
        .send(user)
        .end((err, res) => {
          if (err) console.log(err);

          res.should.have.status(2);
          res.body.data.should.be.a('object');
          res.body.should.have.property('first_name');
          res.body.data.should.have.property('last_name');
          res.body.data.should.have.property('email');
          res.body.data.should.have.property('username');
          res.body.data.should.have.property('address');
          res.body.data.should.have.property('password');
        });
      done();
    });
  });

  after(() => {
    shutdown = require('../../server').shutdown;
  });
});
