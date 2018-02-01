import {addActivity, editActivity, deleteActivity} from '../activity';
import {ADD_ACTIVITY, EDIT_ACTIVITY, DELETE_ACTIVITY} from '../../types';


describe('activity actions', () => {
  set('id', () => 1);
  set('activity', () => ({
    id,
    name: 'Reddit',
    start: '2017-10-21T01:40:00.000Z',
    end: '2017-10-21T02:40:00.000Z',
    is_complete: true,
    duration: 3600,
    session_id: 1,
    category_id: 4
  }));

  describe('add activity', () => {
    it('should create an action to add a activity', () => {
      const expected = {
        type: ADD_ACTIVITY,
        payload: {activity},
      };
      const addActivityAction = addActivity(activity);

      expect(addActivityAction).toEqual(expected);
    });
  });

  describe('edit activity', () => {
    set('newProps', () => ({
      name: 'Study',
    }));

    it('should create an action to edit a activity', () => {
      const expected = {
        type: EDIT_ACTIVITY,
        payload: {newProps, id},
      };
      const editActivityAction = editActivity(id, newProps);

      expect(editActivityAction).toEqual(expected);
    });
  });

  describe('delete activity', () => {
    it('should create an action to delete a activity', () => {
      const expected = {
        type: DELETE_ACTIVITY,
        payload: id
      };
      const deleteActivityAction = deleteActivity(id);

      expect(deleteActivityAction).toEqual(expected);
    });
  });
});