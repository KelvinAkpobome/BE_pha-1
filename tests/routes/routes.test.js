// const agent = require('../../controllers/agentsController');
// const routes = require('../../routes/agents');

// describe('Routes', () => {
//   let server;
//   before(() => {
//     server = require('../../server');
//   });
//   after(() => {
//     server.close();
//   });
//   describe('GETs', () => {
//     it('test server is up ', () => {
//       chai.request('http://localhost:8000')
//         .post('/api/v1/')
//         .end((err, res) => {
//           if (err) return new Error('Shit Happens');
//           expect(res.text).equal('Welcome to PHA API', 'Server is currently down');
//         });
//       // expect(app.post).to.be.calledWith('/api/v1/register/agent', agent.registerAgent);
//     });
//     it('should handle /images/:image_id', () => {
//       expect(app.post).to.be.calledWith('/images/:image_id',
//         image.index);
//     });
//   });
// });
