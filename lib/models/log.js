const pool = require('../utils/pool');

module.exports = class Log {
    id;
    recipeId;
    dateOfEvent;
    notes;
    rating;

    constructor(row) {
        this.id = row.id;
        this.recipeId = row.recipe_id;
        this.dateOfEvent = row.date_of_event;
        this.notes = row.notes;
        this.rating = row.rating;
    }

    static async insert(log) {
        const { rows } = await pool.query(
            'INSERT INTO logs (recipe_id, date_of_event, notes, rating) VALUES ($1, $2, $3, $4) RETURNING *',
            [log.recipeId, log.dateOfEvent, log.notes, log.rating])
            return new Log(rows[0]);
    }

    static async find() {
        const { rows } = await pool.query(
          'SELECT * FROM logs'
        );
    
        return rows.map(row => new Log(row));
      }
}