import {addSession, editSession, deleteSession} from '../session';
import types from '../../types';


describe('session actions', () => {
  set('id', () => 1);
  set('session', () => ({
    id,
    name: 'Study Session 1',
    start: '2017-10-21T22:51:09.489Z',
    end: null,
    is_complete: false,
    user_id: 1,
  }));

  describe('add session', () => {
    it('should create an action to add a session', () => {
      const expected = {
        type: types.ADD_SESSION,
        payload: {session},
      };
      const addSessionAction = addSession(session);

      expect(addSessionAction).toEqual(expected);
    });
  });

  describe('edit session', () => {
    set('newProps', () => ({
      name: 'Study',
    }));

    it('should create an action to edit a session', () => {
      const expected = {
        type: types.EDIT_SESSION,
        payload: {newProps, id},
      };
      const editSessionAction = editSession(id, newProps);

      expect(editSessionAction).toEqual(expected);
    });
  });

  describe('delete session', () => {
    it('should create an action to delete a session', () => {
      const expected = {
        type: types.DELETE_SESSION,
        payload: id
      };
      const deleteSessionAction = deleteSession(id);

      expect(deleteSessionAction).toEqual(expected);
    });
  });
});