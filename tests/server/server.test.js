describe('Server', () => {
  const { boot } = require('../../server');
  after(() => {
    require('../../server').shutdown();
  });

  describe('Server start up test', () => {
    it('test server is up and listening for requests ', () => {
      chai.request(boot)
        .post('/api/v1/')
        .end((err, res) => {
          if (err) return new Error('Shit Happens');
          expect(res.text).equal('Welcome to PHA API', 'Server is not booting up');
          expect(res.status).equal(200, 'Server is not booting up');
        });
    });
  });
});
