const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const Recipe = require('../lib/models/recipe');
const Log = require('../lib/models/log')

describe('recipe-lab routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('creates a recipe', () => {
    return request(app)
      .post('/api/v1/recipes')
      .send({
        name: 'cookies',
        directions: [
          'preheat oven to 375',
          'mix ingredients',
          'put dough on cookie sheet',
          'bake for 10 minutes'
        ]
      })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          name: 'cookies',
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ]
        });
      });
  });

  it('gets all recipes', async() => {
    const recipes = await Promise.all([
      { name: 'cookies', directions: [] },
      { name: 'cake', directions: [] },
      { name: 'pie', directions: [] }
    ].map(recipe => Recipe.insert(recipe)));

    return request(app)
      .get('/api/v1/recipes')
      .then(res => {
        recipes.forEach(recipe => {
          expect(res.body).toContainEqual(recipe);
        });
      });
  });

  it('updates a recipe by id', async() => {
    const recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
    });

    return request(app)
      .put(`/api/v1/recipes/${recipe.id}`)
      .send({
        name: 'good cookies',
        directions: [
          'preheat oven to 375',
          'mix ingredients',
          'put dough on cookie sheet',
          'bake for 10 minutes'
        ]
      })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          name: 'good cookies',
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ]
        });
      });
  });

  it('gets recipe by id', async() => {
    const recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
    });
    
    const response = await request(app)
      .get(`/api/v1/recipes/${recipe.id}`);

    expect(response.body).toEqual(
      {
        id: expect.any(String),
        name: 'cookies',
        directions: [
          'preheat oven to 375',
          'mix ingredients',
          'put dough on cookie sheet',
          'bake for 10 minutes'
        ]
      }
    )
  });

  it('changes recipe', async() => {
    const recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
    });
    
    const response = await request(app)
      .put(`/api/v1/recipes/${recipe.id}`)
      .send({
        name: 'not cookie',
        directions: [
          'dont bake them',
          'please',
        ] 
      });
      expect(response.body).toEqual({
        name: 'not cookie',
        id: recipe.id,
        directions: [
          'dont bake them',
          'please',
        ] 
      });
  });

  it('deletes a recipe', async() => {
      const recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
    });
  })
});

describe('log-lab routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('creates a log', async () => {
    const recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
    });

    return request(app)
      .post('/api/v1/logs')
      .send({
        recipeId: recipe.id,
        dateOfEvent: '2021-01-01',
        notes: 'delicious',
        rating: 5
      })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          recipeId: '1',
          dateOfEvent: '2021-01-01',
          notes: 'delicious',
          rating: '5'
        });
      });
  });

  it('gets all logs', async() => {
    const recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
    });

    const log = await Log.insert({
      recipeId: recipe.id,
      dateOfEvent: '2021-01-01',
      notes: 'delicious',
      rating: "5"
    });

    return request(app)
      .get('/api/v1/logs')
      .then(res => {
        expect(res.body).toEqual([{
          id: log.id,
          recipeId: recipe.id,
          dateOfEvent: '2021-01-01',
          notes: 'delicious',
          rating: "5"
        }])
      });
  });

  it('gets log by id', async() => {
    const recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
    });

    const log = await Log.insert({
      recipeId: recipe.id,
      dateOfEvent: '2021-01-01',
      notes: 'delicious',
      rating: "5"
    });

    return request(app)
      .get(`/api/v1/logs/${log.id}`)
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          recipeId: recipe.id,
          dateOfEvent: '2021-01-01',
          notes: 'delicious',
          rating: '5'
        })
      });
  });

  it('changes log', async() => {
    const recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
    });

    const log = await Log.insert({
      recipeId: recipe.id,
      dateOfEvent: '2021-01-01',
      notes: 'delicious',
      rating: "5"
    });
    
    const response = await request(app)
      .put(`/api/v1/logs/${log.id}`)
      .send({
        recipeId: recipe.id,
        dateOfEvent: '2021-01-01',
        notes: 'aaaaaaaaa',
        rating: '1'
      });
      expect(response.body).toEqual({
        recipeId: recipe.id,
        dateOfEvent: '2021-01-01',
        notes: 'aaaaaaaaa',
        rating: '1',
        id: '1'
      });
  });

  it('gets log by id', async() => {
    const recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
    });

    const log = await Log.insert({
      recipeId: recipe.id,
      dateOfEvent: '2021-01-01',
      notes: 'delicious',
      rating: "5"
    });

    return request(app)
      .delete(`/api/v1/logs/${log.id}`)
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          recipeId: recipe.id,
          dateOfEvent: '2021-01-01',
          notes: 'delicious',
          rating: '5'
        })
      });
  });
});
