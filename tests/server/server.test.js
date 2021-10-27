describe('Server', () => {
  let boot; let
    shutdown;
  before(() => {
    boot = require('../../server').boot;
  });

  describe('GETs', () => {
    it('test server is up ', () => {
      chai.request(boot)
        .post('/api/v1/')
        .end((err, res) => {
          if (err) return new Error('Shit Happens');
          expect(res.text).equal('Welcome to PHA API', 'Server is not booting up');
          expect(res.status).equal(200, 'Server is not booting up');
        });
    });
  });

  after(() => {
    shutdown = require('../../server').shutdown;
  });
});
