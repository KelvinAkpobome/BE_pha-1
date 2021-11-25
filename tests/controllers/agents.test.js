/* eslint-disable quotes */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
/* eslint-disable camelcase */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-shadow */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
describe('Controllers test', () => {
  const { boot } = require('../../server');
  after(() => {
    require('../../server').shutdown();
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
          expect(res).to.be.json;
          expect(res).to.have.status(20000);
          expect(err).to.not.be.an('error');
          expect(res.body).to.have.property('status', 'success');
        });
      done();
    });
  });
});
