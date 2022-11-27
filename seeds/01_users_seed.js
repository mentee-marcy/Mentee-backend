/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del()
  await knex('users').insert([
    {id: 1, first_name: 'jose', last_name:'maz', username:'josemaz', email:'jose@gmail', password:'jose',tech_stack:['java']},
    {id: 2,  first_name: 'shad', last_name:'chow', username:'shadChow', email:'shad@gmail', password:'shad',tech_stack:['c']},
    {id: 3, first_name: 'Noel', last_name:'fer', username:'noelFer', email:'noel@gmail', password:'noel',tech_stack:['react']}
  ]);
};
