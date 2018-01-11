import _ from 'lodash';
import types from '../../actions/types';


const categoryEntities = function(categoryEntities = {}, action) {
  switch(action.type) {
    case types.ADD_CATEGORY: {
      const {category} = action.payload;

      return _.merge({}, categoryEntities, {[category.id]: category});
    }
    case types.EDIT_CATEGORY: {
      const {id, newProps} = action.payload;
      const category = categoryEntities[id];
      const updatedCategory = _.merge({}, category, newProps);

      return _.merge({}, categoryEntities, {[id]: updatedCategory});
    }
    case types.DELETE_CATEGORY: {
      const {id} = action.payload;
      const remainingEntities = {};

      _.mapKeys(sessionEntities, (category, categoryId) => {
        if (id !== parseInt(categoryId)) {
          const category = categoryEntities[categoryId];

          remainingEntities[categoryId] = category;
        }
      });

      return remainingEntities;
    }
    default:
      return categoryEntities;
  }
};


export default categoryEntities;