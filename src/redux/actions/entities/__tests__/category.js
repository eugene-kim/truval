import {addCategory, editCategory, deleteCategory} from '../category';
import types from '../../types';


describe('category actions', () => {
  set('id', () => 1);
  set('category', () => ({
    id: 1,
    name: 'CODE',
    is_primary: true,
    color: '#3E416A',
    user_id: 1,
  }));

  describe('add category', () => {
    it('should create an action to add a category', () => {
      const expected = {
        type: types.ADD_CATEGORY,
        payload: {category},
      };
      const addCategoryAction = addCategory(category);

      expect(addCategoryAction).toEqual(expected);
    });
  });

  describe('edit category', () => {
    set('newProps', () => ({
      name: 'Study',
    }));

    it('should create an action to edit a category', () => {
      const expected = {
        type: types.EDIT_CATEGORY,
        payload: {newProps, id},
      };
      const editCategoryAction = editCategory(id, newProps);

      expect(editCategoryAction).toEqual(expected);
    });
  });

  describe('delete category', () => {
    it('should create an action to delete a category', () => {
      const expected = {
        type: types.DELETE_CATEGORY,
        payload: id
      };
      const deleteCategoryAction = deleteCategory(id);

      expect(deleteCategoryAction).toEqual(expected);
    });
  });
});