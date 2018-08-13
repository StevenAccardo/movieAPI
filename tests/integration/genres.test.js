//Allows us to send requests to an endpoint, similar to postman, without having to do it manually
const request = require('supertest');
const { Genre } = require('../../models/Genre');
const { User } = require('../../models/User');
const mongoose = require('mongoose');

let server;

describe('/api/genres', () => {
  //imports the app.listen method from index.js
  beforeEach(() => { server = require('../../index'); });
  //closes server
  //and clears out our test DB
  afterEach(async () => {
    server.close();
    await Genre.remove({});
  });

  describe('GET /', () => {

    it('should return all genres', async () => {
      //allows us to create many model instances
      //Using longer genre names so that we pass Joi validation checks, since this will be testing the full path
      await Genre.collection.insertMany([
        { name: 'genre1' },
        { name: 'genre2' }
      ]);
      //request returns a promise, so you can use async/await
      const res = await request(server).get('/api/genres');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some(g => g.name === 'genre1')).toBeTruthy();
      expect(res.body.some(g => g.name === 'genre2')).toBeTruthy();
    });
  });

  describe('GET /:id', () => {
    it('should return a genre if valid id is passed', async () => {
      const genre = new Genre({ name: 'genre1' });
      await genre.save();

      const res = await request(server).get('/api/genres/' + genre._id);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', genre.name);
    });

    it('should return 404 if invalid id is passed', async () => {

      const res = await request(server).get('/api/genres/1');

      expect(res.status).toBe(404);
    });

    it('should return 404 if no genre with the given id exists', async () => {
      const id = mongoose.Types.ObjectId();
      const res = await request(server).get('/api/genres/' + id);

      expect(res.status).toBe(404);
    });
  });

  describe('POST /', () => {

    let token;
    let name;

    const exec = async () => {
      console.log(name);
      return await request(server)
        .post('/api/genres')
        //sets a field on the header
        .set('x-auth-token', token)
        .send({ name });
    }

    beforeEach(() => {
      token = new User().generateAuthToken();
      name = 'genre1';
    })

    it('should return 401 if client is not logged in', async () => {
      token = '';

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 400 if genre is less than 5 characters', async () => {

      name = '1234';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if genre is more than 50 characters', async () => {
      name = new Array(52).join('a');

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should save the genre if it is valid', async () => {

      await exec();

      const genre = await Genre.find({name: 'genre1' });

      expect(genre).not.toBeNull();
    });

    it('should return the genre if it is valid', async () => {

      const res = await exec();

      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('name', 'genre1');
    });
  });
});
