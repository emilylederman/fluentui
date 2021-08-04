import * as React from 'react';

import { JSONTreeElement } from '../../types';
import { AccessibilityError } from '../../../accessibility/types';
import { AccessibilityComponentTree } from '../AccessibilityComponentTree';

export type AccessibilityTabPanelProps = {
  accessibilityErrors: AccessibilityError[];
  jsonTree: JSONTreeElement;
  onSelectComponent?: (jsonTreeElement: JSONTreeElement) => void;
  selectedComponent?: JSONTreeElement;
  selectedComponentAccessibilityErrors?: AccessibilityError[];
};

export const AccessibilityTabPanel: React.FunctionComponent<AccessibilityTabPanelProps> = (
  props: AccessibilityTabPanelProps,
) => {
  const currentChildren = props.jsonTree?.props?.children;

  const filteredChildren = [];
  if (currentChildren) {
    for (const child of currentChildren) {
      if (props.accessibilityErrors.find(e => e.elementUuid === (child as JSONTreeElement).uuid)) {
        filteredChildren.push(child);
      }
    }
  }

  const accessibilityErrorTree = {
    uuid: props.jsonTree.uuid,
    type: props.jsonTree.type,
    props: {
      children: filteredChildren,
    },
  } as JSONTreeElement;

  return (
    <div>
      <div style={{ padding: '15px', wordWrap: 'break-word', fontWeight: 'lighter' }}>
        To learn more about best practices for accessibility, visit{' '}
        <a
          aria-describedby="microsoft accessibility website"
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.microsoft.com/en-us/accessibility"
        >
          https://www.microsoft.com/en-us/accessibility
        </a>
        .
      </div>
      <hr style={{ margin: 'auto', width: '75%', marginBottom: 'em' }} />
      {(!accessibilityErrorTree || accessibilityErrorTree?.props?.children?.length === 0) && (
        <div style={{ padding: '10px' }}>No accessibility errors found.</div>
      )}
      <div>
        <AccessibilityComponentTree
          onSelectComponent={props.onSelectComponent}
          selectedComponent={props.selectedComponent}
          selectedComponentAccessibilityErrors={props.selectedComponentAccessibilityErrors}
          tree={accessibilityErrorTree}
        />
      </div>
    </div>
  );
};
