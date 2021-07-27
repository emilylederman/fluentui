import * as React from 'react';
import { Button } from '@fluentui/react-northstar';
import { useCopyToClipboard } from '@fluentui/docs-components';
import { LinkIcon } from '@fluentui/react-icons-northstar/src';

/* <Button
          style={{ marginLeft: '.8rem' }}
          iconOnly
          title={'Maximize builder'}
          icon={<OpenOutsideIcon outline />}
          aria-label="Popout"
          onClick={() => {
            window.open(`/builder/maximize${window.location.hash}`, '_blank', 'noopener noreferrer');
          }}
        />
        */
export const GetShareableLink: React.FunctionComponent<{
  getShareableLink: () => string;
  style?: React.CSSProperties;
}> = ({ getShareableLink, style }) => {
  const [active, onCopy] = useCopyToClipboard(getShareableLink);
  return (
    <Button
      style={style}
      iconOnly
      icon={<LinkIcon outline />}
      title={'get sharable link'}
      aria-label={'get sharable link'}
      onClick={onCopy}
      disabled={active}
    />
  );
};
