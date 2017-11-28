import {addUser, editUser, deleteUser} from '../user';
import types from '../../types';


describe('user actions', () => {
  set('id', () => 1);
  set('user', () => ({
    id,
    name: 'Huge Euge',
    password: 'password',
    email: 'huge_euge@gmail.com',
  }));

  describe('add user', () => {
    it('should create an action to add a user', () => {
      const expected = {
        type: types.ADD_USER,
        payload: {user},
      };
      const addUserAction = addUser(user);

      expect(addUserAction).toEqual(expected);
    });
  });

  describe('edit user', () => {
    set('newProps', () => ({
      name: 'new name',
      password: 'new password',
    }));

    it('should create an action to edit a user', () => {
      const expected = {
        type: types.EDIT_USER,
        payload: {newProps, id},
      };
      const editUserAction = editUser(id, newProps);

      expect(editUserAction).toEqual(expected);
    });
  });

  describe('delete user', () => {
    it('should create an action to delete a user', () => {
      const expected = {
        type: types.DELETE_USER,
        payload: id
      };
      const deleteUserAction = deleteUser(id);

      expect(deleteUserAction).toEqual(expected);
    });
  });
});