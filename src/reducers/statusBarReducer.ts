import _ from 'lodash';

export const CONCEPT_STATUS_PATCH_SUCCESS = 'CONCEPT_STATUS_PATCH_SUCCESS';
export const CONCEPT_STATUS_IS_SAVING = 'CONCEPT_STATUS_IS_SAVING';
export const CONCEPT_STATUS_SAVE_ERROR = 'CONCEPT_STATUS_SAVE_ERROR';

export const conceptPatchSuccessAction = (conceptId, patch, response) => ({
  type: CONCEPT_STATUS_PATCH_SUCCESS,
  payload: {
    conceptId: conceptId,
    patch: patch,
    concept: response
  }
});

export const conceptPatchIsSavingAction = conceptId => ({
  type: CONCEPT_STATUS_IS_SAVING,
  payload: {
    conceptId
  }
});

export const conceptPatchErrorAction = (conceptId, error) => ({
  type: CONCEPT_STATUS_SAVE_ERROR,
  payload: {
    conceptId,
    error
  }
});

export const statusBarReducer = (state, action) => {
  switch (action.type) {
    case CONCEPT_STATUS_IS_SAVING: {
      const { conceptId } = action.payload;
      return {
        ...state,
        [conceptId]: {
          ..._.get(state, [conceptId]),
          isSaving: true
        }
      };
    }
    case CONCEPT_STATUS_PATCH_SUCCESS: {
      const { conceptId, patch, concept } = action.payload;
      const justPublishedOrUnPublished = !!_.get(patch, 'status');
      const status = _.get(concept, 'status');
      return {
        ...state,
        [conceptId]: {
          ..._.get(state, [conceptId]),
          isSaving: false,
          status,
          justPublishedOrUnPublished
        }
      };
    }
    case CONCEPT_STATUS_SAVE_ERROR: {
      const { conceptId, error } = action.payload;
      return {
        ...state,
        [conceptId]: {
          ..._.get(state, [conceptId]),
          isSaving: false,
          error
        }
      };
    }
    default:
      return state;
  }
};