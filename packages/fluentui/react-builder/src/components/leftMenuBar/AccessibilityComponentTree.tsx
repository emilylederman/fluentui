import * as React from 'react';
import { TreeItemProps, Tree, Label } from '@fluentui/react-northstar';
import { treeBehavior, treeAsListBehavior } from '@fluentui/accessibility';
import { JSONTreeElement } from '../types';
import { jsonTreeFindElement } from '../../config';
import { getUUID } from '../../utils/getUUID';
import { AccessibilityError } from '../../accessibility/types';

export type AccessibilityComponentTreeProps = {
  tree: JSONTreeElement;
  selectedComponent?: JSONTreeElement;
  selectedComponentAccessibilityErrors?: AccessibilityError[];
  onSelectComponent?: (jsonTreeElement: JSONTreeElement) => void;
};

const isMac = navigator.userAgent.indexOf('Mac OS X') !== -1;
const behavior = isMac ? treeAsListBehavior : treeBehavior;

const macKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
  const keyCode = e.keyCode || e.which;
  const F10 = 121;
  if (e.shiftKey && keyCode === F10) {
    const activeElement = document.activeElement;
    if (activeElement) {
      const event = new MouseEvent('contextmenu', { bubbles: true });
      activeElement.dispatchEvent(event);
    }
  }
};

const treeKeyDown = isMac ? macKeyDown : undefined;

const jsonTreeToTreeItems: (
  tree: JSONTreeElement | string,
  selectedComponentId: string,
  selectedComponentAccessibilityErrors: AccessibilityError[],
  handleSelectedComponent: TreeItemProps['onTitleClick'],
) => TreeItemProps = (tree, selectedComponentId, selectedComponentAccessibilityErrors, handleSelectedComponent) => {
  // calculate number of accessibility errors
  // todo: test, create function as class?
  if (typeof tree === 'string') {
    return {
      id: getUUID(),
      title: 'string',
    };
  }
  return {
    onTitleClick: handleSelectedComponent,
    id: tree.uuid as string,
    title: {
      content: tree.displayName,
      style: {
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        padding: '2px 4px',
        ...(selectedComponentId === tree.uuid && {
          background: '#ffc65c',
          color: '#444',
        }),
      },
    },

    ...(selectedComponentId === tree.uuid && {
      renderItemTitle: (C, { content, ...props }) => {
        return (
          <C {...props}>
            <span style={{ flex: 1 }}>
              {content}
              <Label
                style={{
                  justifyContent: 'center',
                  fontSize: '.75em',
                  userSelect: 'none',
                  MozUserSelect: '-moz-none',
                  WebkitUserSelect: 'none',
                  float: 'right',
                }}
                color={'red'}
                content={`${selectedComponentAccessibilityErrors.length}`}
                circular
                fluid
              />
            </span>
          </C>
        );
      },
    }),
    items: tree.props?.children?.map(item =>
      jsonTreeToTreeItems(item, selectedComponentId, selectedComponentAccessibilityErrors, handleSelectedComponent),
    ),
  };
};

export const AccessibilityComponentTree: React.FunctionComponent<AccessibilityComponentTreeProps> = ({
  tree,
  selectedComponent,
  selectedComponentAccessibilityErrors,
  onSelectComponent,
}) => {
  const handleSelectComponent = React.useCallback(
    (e, props: TreeItemProps) => {
      onSelectComponent?.(jsonTreeFindElement(tree, props.id));
    },
    [onSelectComponent, tree],
  );
  const activeItems = [];
  const getActiveItemIds = item => {
    if (item.items) {
      activeItems.push(item.id);
      item.items.forEach(i => getActiveItemIds(i));
    }
  };

  const selectedComponentId = selectedComponent?.uuid as string;
  const items: TreeItemProps[] =
    tree.props?.children?.map(item =>
      jsonTreeToTreeItems(item, selectedComponentId, selectedComponentAccessibilityErrors, handleSelectComponent),
    ) ?? [];
  items.forEach(item => getActiveItemIds(item));

  return (
    <Tree
      accessibility={behavior}
      onKeyDown={treeKeyDown}
      items={items}
      activeItemIds={activeItems}
      styles={{
        minHeight: '17rem',
        maxHeight: '57rem',
      }}
    />
  );
};
