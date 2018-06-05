import React, {Component} from 'react';
import styled from 'styled-components';
import PropTypes from 'src/view/util/PropTypes';
import {Text, TextInput, View} from 'styled-x';
import { Formik } from 'formik';

// Redux
import { connect } from 'react-redux';
import { getEntityByName, getEntitiesList } from 'src/redux/selectors/entitySelectors';
import {
  createActivityInstance,
  updateActivityInstance,
} from 'src/redux/actions/entities/activityInstance';
import { closeAddActivityModal } from 'src/redux/actions/app/screenState';

// Styles
import Colors from 'src/view/styles/colors';
import TextStyles from 'src/view/styles/text/textStyles';

import { getDuration, getCurrentISOString } from 'src/libs/util/Datetime';

// Components
import NewActivitySubmitButton from './components/NewActivitySubmitButton';
import ActivityInput from './components/ActivityInput';
import AddActivityFormErrors from './components/AddActivityFormErrors';
import SelectCategoryModal from '../SelectCategoryModal';


const AddNewActivityForm = ({
  categories,
  getActivityTypeByName,
  handleSubmit,
  session,
}) => {

  // --------------------------------------------------
  // Styled Components
  // --------------------------------------------------

  const Container = styled.View`
    flex: 1
    flexBasis: auto
  `;

  const FormContainer = styled.View`
    flex: 1
    flexBasis: auto
    alignItems: stretch
  `;

  const Input = styled(ActivityInput)`
    marginBottom: 12
  `;

  const Errors = styled(AddActivityFormErrors)`
    marginBottom: 5
  `;

  const SelectCategoryContainer = styled.View`
    flex: 1
    backgroundColor: red
    position: absolute
  `;

  // --------------------------------------------------
  // Methods
  // --------------------------------------------------
  const activityNameMaxLength = 30;

  /**
   * Formik doesn't pass in props to its validate() function, so
   * we'll be using currying to pass in props.
   *
   * Relevant question here: https://github.com/jaredpalmer/formik/issues/647
   */
  const validateForm = ({getActivityTypeByName}) => values => {
    const errors = {};
    const {activityName, category} = values;

    // Validate activity name.
    if (!activityName) {
      errors.activityName = 'Activity name is required to create a new activity.';
    } else if (activityName.length > activityNameMaxLength) {
      errors.activityName = `Activity name must be fewer than ${activityNameMaxLength} characters.`;
    } else if (getActivityTypeByName(activityName)) {
      errors.activityName = `Activity name already exists.`;
    }

    // Validate category.
    if (!category) {
      errors.category = 'Activity must have a category.';
    }

    return errors;
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <Container>
      <Formik
        initialValues={{'activityName': ''}}
        onSubmit={handleSubmit}
        validate={validateForm({getActivityTypeByName})}
        validateOnBlur={false}
        validateOnChange={false}
        render={formikProps => {

          const {
            setFieldValue,
            values,
            errors,
            handleSubmit,
          } = formikProps;

          return (
            <FormContainer>
              <Input
                setFieldValue={setFieldValue}
                values={values}
                maxNameLength={activityNameMaxLength}
              />
              <Errors errors={errors} />
              <NewActivitySubmitButton
                handlePress={formikProps.handleSubmit}
              />
            </FormContainer>
          )
        }}
      />
    </Container>
  );
}


// --------------------------------------------------
// Props
// --------------------------------------------------
AddNewActivityForm.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.category).isRequired,
  getActivityTypeByName: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  session: PropTypes.session.isRequired,
}


export default connect(

  // mapStateToProps
  (state, ownProps) => ({
    getActivityTypeByName: name => getEntityByName({name, entityType: 'activityType', state}),

    // TODO: Sort these somehow.
    categories: getEntitiesList({entityType: 'category', state}),
  }),

  // mapDispatchToProps
  (dispatch, ownProps) => {

    return {
      handleSubmit: (values, formikBag) => {
        const {activityName, category} = values;
        const {session, liveActivityInstance, gqlClient} = ownProps;
        const {start} = liveActivityInstance;
        const now = getCurrentISOString();
        const duration = getDuration(start, now);

        const updateActivityInstanceAction = updateActivityInstance({
          id: liveActivityInstance.id,
          propsToUpdate: {
            end: now,
            duration,
            isComplete: true,
          },
          client: gqlClient,
        });

        const createActivityInstanceAction = createActivityInstance({
          activityInstance: {
            isComplete: false,
            name: activityName,
            sessionId: session.id,
            start: now,
            // categoryId: category.id,
            // TODO: Remove when finished testing.
            categoryId: '51d017c1-57f1-401c-a16f-7f8142fb37d6',

            // TODO: Hardcoded for testing purposes. Remove when you figure out what
            // to do with authentication.
            userId: 'cb39dbb5-caa8-4323-93a5-13450b875887',
          },
          client: gqlClient,
        });

        const closeAddActivityModalAction = closeAddActivityModal();

        dispatch(updateActivityInstanceAction);
        dispatch(createActivityInstanceAction);
        dispatch(closeAddActivityModalAction);
      }
    }
  },
)(AddNewActivityForm);
