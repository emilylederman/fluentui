import * as React from 'react';

import { Button } from '@fluentui/react-northstar';
import { ComponentTree } from '../ComponentTree';
import { JSONTreeElement } from '../types';
import { AccessibilityError } from '../../accessibility/types';

export type AccessibilityTabPanelProps = {
  accessibilityErrors: AccessibilityError[];
  jsonTree: JSONTreeElement;
  onAddComponent?: (uuid: string, where: string) => void;
  onCloneComponent?: ({ clientX, clientY }: { clientX: number; clientY: number }) => void;
  onDeleteSelectedComponent?: () => void;
  onDragStart?: (info: any, e: any) => void;
  onOpenAddComponentDialog?: (uuid: string, where: string) => void;
  onMoveComponent?: ({ clientX, clientY }: { clientX: number; clientY: number }) => void;
  onSelectComponent?: (jsonTreeElement: JSONTreeElement) => void;
  selectedComponent?: JSONTreeElement;
  selectedComponentAccessibilityErrors: AccessibilityError[];
};

export const AccessibilityTabPanel: React.FunctionComponent<AccessibilityTabPanelProps> = (
  props: AccessibilityTabPanelProps,
) => {
  const currentChildren = props.jsonTree.props.children;
  const filteredChildren = [];
  if (currentChildren) {
    for (const child of currentChildren) {
      if (props.accessibilityErrors.find(e => e.elementUuid === (child as JSONTreeElement).uuid)) {
        filteredChildren.push(child);
      }
    }
  }

  const updatedElement = {
    uuid: props.jsonTree.uuid,
    type: props.jsonTree.type,
    props: {
      children: filteredChildren,
    },
  } as JSONTreeElement;

  return (
    <div>
      {(!props.jsonTree?.props?.children || props.jsonTree?.props?.children?.length === 0) && (
        <Button
          text
          content="Insert first component"
          fluid
          onClick={() => props.onOpenAddComponentDialog('', 'first')}
        />
      )}
      <ComponentTree
        tree={updatedElement}
        selectedComponent={props.selectedComponent}
        selectedComponentAccessibilityErrors={props.selectedComponentAccessibilityErrors}
        onSelectComponent={props.onSelectComponent}
        onCloneComponent={props.onCloneComponent}
        onMoveComponent={props.onMoveComponent}
        onDeleteSelectedComponent={props.onDeleteSelectedComponent}
        onAddComponent={props.onAddComponent}
      />
    </div>
  );
};
