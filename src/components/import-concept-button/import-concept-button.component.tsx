import React from 'react';
import { localization } from '../../lib/localization';
import './import-concept-button.scss';
import { ReactComponent as IconAdd } from '../../assets/img/icon-add-cicle-sm.svg';

const allowedMimeTypes = [
  'text/csv',
  'text/x-csv',
  'text/plain',
  'application/csv',
  'application/x-csv',
  'application/vnd.ms-excel',
  'application/json'
];

export const ImportConceptButton = ({ onUpload }): JSX.Element | null => (
  <label
    htmlFor="file-upload"
    aria-haspopup="true"
    aria-expanded="false"
    className="custom-file-upload fdk-button fdk-button-import-concept btn btn-light mb-4"
  >
    <IconAdd className="fdk-icon-import mr-2" />
    {localization.importNewConcept}
    <input id="file-upload" type="file" accept={allowedMimeTypes.join(', ')} onChange={onUpload} />
  </label>
);

export default ImportConceptButton;
