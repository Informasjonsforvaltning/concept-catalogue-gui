import React, { useState, useContext } from 'react';
import cx from 'classnames';
import _ from 'lodash';
import { Button } from 'reactstrap';

import { localization } from '../../lib/localization';
import { StatusBarContext } from '../../context/statusBarContext';
import { patchConceptFromForm } from '../../lib/patchConceptForm';
import { deleteConcept } from '../../api/concept-registration-api';
import './status-bar.scss';

const CONCEPT_STATUS_PUBLISHED = 'publisert';
const CONCEPT_STATUS_DRAFT = 'utkast';

interface ErrorOverlayProps {
  error?: object;
}

const renderErrorOverlay = ({ error }: ErrorOverlayProps): JSX.Element => (
  <div className="form-status-bar-overlay d-flex align-items-center justify-content-between alert-warning">
    {`${localization.errorSaving} - ${error}`}
  </div>
);

interface ConfirmDeleteOverlayProps {
  deleteConceptAndNavigate: Function;
  toggleShowConfirmDelete: Function;
}

const renderConfirmDeleteOverlayDialog = ({
  deleteConceptAndNavigate,
  toggleShowConfirmDelete
}: ConfirmDeleteOverlayProps): JSX.Element => (
  <div className="form-status-bar-overlay d-flex align-items-center justify-content-between alert-danger">
    <div>
      <span>{localization.confirmDeleteMessage}</span>
    </div>
    <div>
      <Button className="fdk-button mr-3" color="primary" onClick={deleteConceptAndNavigate}>
        {localization.confirmDelete}
      </Button>
      <button
        type="button"
        className="btn bg-transparent fdk-color-blue-dark"
        onClick={() => toggleShowConfirmDelete()}
      >
        {localization.cancelDelete}
      </button>
    </div>
  </div>
);

interface Props {
  concept: object;
  history: any;
  catalogId: string;
}

export const StatusBar = ({ concept, history, catalogId }: Props): JSX.Element => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const toggleShowConfirmDelete = (): void => setShowConfirmDelete(!showConfirmDelete);

  const conceptId = _.get(concept, 'id');
  const published = _.get(concept, 'status') === CONCEPT_STATUS_PUBLISHED;

  const { statusBarState, dispatch } = useContext(StatusBarContext);

  const status = _.get(statusBarState, [conceptId, 'status']);
  const justPublishedOrUnPublished = _.get(statusBarState, [conceptId, 'justPublishedOrUnPublished']);
  const isSaving = _.get(statusBarState, [conceptId, 'isSaving'], false);
  const error = _.get(statusBarState, [conceptId, 'error']);

  let messageClass;
  let message;

  if (justPublishedOrUnPublished) {
    messageClass = 'alert-success';
    message = status === CONCEPT_STATUS_PUBLISHED ? localization.conceptPublished : localization.conceptUnPublished;
  } else {
    messageClass = 'alert-primary';
    if (isSaving) {
      message = `${localization.isSaving}...`;
    } else if (published || status === CONCEPT_STATUS_PUBLISHED) {
      message = `${localization.changesUpdated}.`;
    } else {
      message = `${localization.savedAsDraft}.`;
    }
  }

  const deleteConceptAndNavigate = async (): Promise<void> => {
    await deleteConcept(conceptId);
    history && history.push(`/${catalogId}`);
  };

  return (
    <>
      {error && renderErrorOverlay({ error })}
      {showConfirmDelete &&
        renderConfirmDeleteOverlayDialog({
          deleteConceptAndNavigate,
          toggleShowConfirmDelete
        })}
      <div
        className={cx(
          'form-status-bar',
          'd-flex',
          'align-items-center',
          'justify-content-between',
          'fadeFromBottom-500',
          messageClass
        )}
      >
        {<div>{message}</div>}

        {!published && (!status || status === CONCEPT_STATUS_DRAFT) && (
          <div className="d-flex">
            <Button
              id="dataset-setPublish-button"
              className="fdk-button mr-3"
              color="primary"
              onClick={() => patchConceptFromForm({ status: CONCEPT_STATUS_PUBLISHED }, { concept, dispatch })}
            >
              {localization.publish}
            </Button>

            <button
              type="button"
              className="btn bg-transparent fdk-color-blue-dark"
              disabled={isSaving}
              onClick={toggleShowConfirmDelete}
            >
              {localization.delete}
            </button>
          </div>
        )}
      </div>
    </>
  );
};