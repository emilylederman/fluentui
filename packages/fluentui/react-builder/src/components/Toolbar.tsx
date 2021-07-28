import * as React from 'react';
import {
  Box,
  Button,
  Image,
  MenuButton,
  Text,
  Toolbar as FUIToolbar,
  ToolbarItemProps,
  Tooltip,
} from '@fluentui/react-northstar';
import { DesignerMode } from './types';
import {
  CodeSnippetIcon,
  OpenOutsideIcon,
  TrashCanIcon,
  UndoIcon,
  RedoIcon,
  TranslationIcon,
} from '@fluentui/react-icons-northstar';

export type ToolbarProps = {
  canRedo: boolean;
  canUndo: boolean;
  onModeChange: (mode: DesignerMode) => void;
  onReset: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onShowCodeChange: (showCode: boolean) => void;
  onShowJSONTreeChange: (showJSONTree: boolean) => void;
  mode: DesignerMode;
  showCode: boolean;
  showJSONTree: boolean;
  enabledVirtualCursor: boolean;
  onEnableVirtualCursor: (enabledVirtualCursor: boolean) => void;
  style?: React.CSSProperties;
};

export const Toolbar: React.FunctionComponent<ToolbarProps> = ({
  canRedo,
  canUndo,
  onModeChange,
  onReset,
  onUndo,
  onRedo,
  onShowCodeChange,
  onShowJSONTreeChange,
  mode,
  showCode,
  showJSONTree,
  enabledVirtualCursor,
  onEnableVirtualCursor,
  style,
}) => {
  const [showVcInfo, setShowVcInfo] = React.useState(false);

  // todo make designermode an enum!!!!
  const modeLabel = (toolbarModeItem: DesignerMode) =>
    toolbarModeItem === mode ? (
      <Text weight={'bold'} aria-label={`current mode: ${mode} `}>
        {toolbarModeItem.replace(/^\w/, (c: string) => c.toUpperCase())}
      </Text>
    ) : (
      <Text color={'#c8c6c4'} weight={'light'} aria-label={`switch to ${toolbarModeItem} `}>
        {toolbarModeItem.replace(/^\w/, (c: string) => c.toUpperCase())}
      </Text>
    );
  return (
    <Box
      styles={({ theme }) => ({
        display: 'flex',
        padding: '0 1rem',
        alignItems: 'center',
        borderBottom: `1px solid ${theme.siteVariables.colorScheme.default.border2}`,
        background: theme.siteVariables.colorScheme.default.background1,
        ...style,
      })}
    >
      <Image
        styles={{ height: '1.5rem' }}
        src="https://fabricweb.azureedge.net/fabric-website/assets/images/fluent-ui-logo.png"
      />
      <div style={{ position: 'relative', padding: '0 .8rem', fontSize: '14px', lineHeight: 1, fontWeight: 'bold' }}>
        FluentUI <span style={{ fontWeight: 'normal' }}>Builder</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
        <FUIToolbar
          aria-label="Builder toolbar"
          items={[
            {
              key: 'build',
              title: 'Build Mode',
              children: modeLabel('build'),
              onClick: () => {
                onModeChange('build');
                onEnableVirtualCursor(false);
              },
            },
            {
              key: 'divider-1',
              kind: 'divider',
            },
            {
              key: 'design',
              title: 'Design Mode',
              children: modeLabel('design'),
              onClick: () => {
                onModeChange('design');
                onEnableVirtualCursor(false);
              },
            },
            {
              key: 'divider-2',
              kind: 'divider',
            },
            {
              key: 'use',
              title: 'Use Mode',
              children: modeLabel('use'),
              onClick: () => {
                onModeChange('use');
              },
            },
            mode === 'use'
              ? ({
                  key: 'screen-reader',
                  icon: <TranslationIcon outline={true} />,
                  kind: 'toggle',
                  active: !!enabledVirtualCursor,
                  title: 'Screen reader simulation',
                  onClick: () => {
                    onEnableVirtualCursor(!enabledVirtualCursor);
                    setShowVcInfo(true);
                    setTimeout(() => setShowVcInfo(false), 10000);
                  },
                  children: (C, p) => (
                    <Tooltip
                      accessibility={null}
                      trigger={<C {...p} />}
                      content={<span role="alert">Use "ctrl+," and "ctrl+." to navigate in the canvas</span>}
                      open={enabledVirtualCursor && showVcInfo}
                    />
                  ),
                } as ToolbarItemProps)
              : undefined,
            {
              key: 'divider-3',
              kind: 'divider',
            },
            {
              icon: <UndoIcon outline={true} />,
              key: 'undo',
              // kind: 'toggle',
              disabled: !canUndo,
              title: 'Undo [ctrl+z]',
              onClick: () => {
                onUndo();
              },
            },
            {
              icon: <RedoIcon outline={true} />,
              key: 'redo',
              // kind: 'toggle',
              disabled: !canRedo,
              title: 'Redo [ctrl+shift+z]',
              onClick: () => {
                onRedo();
              },
            },
            {
              key: 'divider-4',
              kind: 'divider',
            },
            {
              icon: <TrashCanIcon outline={true} />,
              key: 'delete',
              // kind: 'toggle',
              title: 'Start over',
              onClick: () => {
                onReset();
              },
            },
          ]}
        />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
        <MenuButton
          trigger={<Button iconOnly icon={<CodeSnippetIcon outline />} aria-label="Show code" />}
          menu={[
            {
              key: 'code',
              content: 'Show code',
              onClick: () => {
                onShowCodeChange(!showCode);
                if (showJSONTree) onShowJSONTreeChange(!showJSONTree);
              },
            },
            {
              key: 'json',
              content: 'Show JSON',
              onClick: () => {
                onShowJSONTreeChange(!showJSONTree);
                if (showCode) onShowCodeChange(!showCode);
              },
            },
          ]}
        />
        <Button
          style={{ marginLeft: '.8rem' }}
          iconOnly
          title={'Maximize builder'}
          icon={<OpenOutsideIcon outline />}
          aria-label="Popout"
          onClick={() => {
            window.open(`/builder/maximize${window.location.hash}`, '_blank', 'noopener noreferrer');
          }}
        />
      </div>
    </Box>
  );
};
