import {addUser, editUser, deleteUser} from '../user';
import types from '../../types';


describe('user actions', () => {
  set('user', () => ({
    id: 1,
    name: 'Huge Euge',
    password: 'password',
    email: 'huge_euge@gmail.com',
  }));

  it('should create an action to add a user', () => {
    const expectedAction = {
      type: types.ADD_USER,
      payload: {user},
    };

    expect(addUser(user)).toEqual(expectedAction);
  });
});