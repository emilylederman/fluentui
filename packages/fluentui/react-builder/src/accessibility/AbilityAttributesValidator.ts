import * as React from 'react';

import { setup } from '../ability-attributes/DevEnv';
import { JSONTreeElement } from '../components/types';
import { jsonTreeFindElement } from '../config';
import { AccessibilityError } from './types';

export type AccessibilityErrors = Record<string, Record<string, string>>;

export type AbilityAttributesValidatorProps = {
  window: Window;
  jsonTree: JSONTreeElement;
  onErrorsChanged: (errors: AccessibilityError[]) => void;
};

const getBuilderId = el => {
  return el ? el.getAttribute('data-builder-id') ?? getBuilderId(el.parentElement) : undefined;
};

export const AbilityAttributesValidator: React.FunctionComponent<AbilityAttributesValidatorProps> = ({
  window,
  jsonTree,
  onErrorsChanged,
}) => {
  const [errors, setErrors] = React.useState({});

  React.useMemo(() => {
    setup({
      enforceClasses: false,
      ignoreUnknownClasses: true,
      window,
      errorReporter: {
        remove(element: HTMLElement) {
          console.log('remove', element);
          // setErrors(errors => Object.entries(errors).filter(error => error[0] !== getBuilderId(element)));
        },
        report(element: HTMLElement, error: any /* AbilityAttributesError */) {
          setErrors(errors => ({ ...errors, [getBuilderId(element)]: error.message }));
        },
      },
    });
  }, [window]);

  React.useMemo(() => {
    console.log('AbilityAttributesValidator - errors changed', errors);
    onErrorsChanged(
      Object.entries(errors)
        .map(
          error =>
            ({
              elementUuid: error[0],
              source: 'AA',
              message: error[1],
            } as AccessibilityError),
        )
        .filter(error => jsonTreeFindElement(jsonTree, error.elementUuid) !== null),
    );
  }, [jsonTree, errors, onErrorsChanged]);

  return null;
};
