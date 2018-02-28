import initialState from 'redux/store/initialState';
import activityInstanceEntities from './resources/activityInstanceEntities';
import activityTypeEntities from './resources/activityTypeEntities';

import activityTypeReducer from 'redux/reducers/entities/activityType';
import { deleteActivityInstance } from 'redux/actions/entities/activityInstance';


describe('activityInstance entity reducer tests', () => {
  set('initialStoreState', () => _.merge(
    {},
    initialState,
    {
      entities: {
        activityInstance: {
          entities: activityInstanceEntities,
        },
        activityType: {
          entities: activityTypeEntities,
        }
      }
    }
  ));

  describe('DELETE_ACTIVITY_INSTANCE', () => {
    set('deleteActivityInstanceAction', () => deleteActivityInstance({
      id: 'c72cea78-2027-4615-a6a1-3daca28c9bba',
      activityTypeId: '1982f070-704c-4054-beb4-ea188399fc10',
    }));

    set('activityInstanceEntities', () => initialStoreState.entities.activityInstance.entities);
    set('activityTypeEntities', () => initialStoreState.entities.activityType.entities);

    it(`Related activityType activityCount is reduced by 1.`, () => {
      const updatedActivityTypeEntities = activityTypeReducer(activityTypeEntities, deleteActivityInstanceAction);
      const updatedActivityType = updatedActivityTypeEntities['1982f070-704c-4054-beb4-ea188399fc10'];
      const updatedActivityCount = updatedActivityType.activityCount;
      const expectedActivityCount = 5;

      expect(updatedActivityCount).toEqual(expectedActivityCount);
    });
  });
});