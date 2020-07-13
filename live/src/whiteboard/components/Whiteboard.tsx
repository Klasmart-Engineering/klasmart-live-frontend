import React from 'react';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import { useWhiteboard } from './WhiteboardProvider';
import { EventDrivenCanvas } from './EventDrivenCanvas';
import { Toolbar } from './Toolbar';

const containerStyle: CSSProperties = {
  lineHeight: '0',
  width: '800px',
  height: '440px',
};

const canvasStyle: CSSProperties = {
  border: '2px blue solid',
  width: '400px',
  height: '400px',
};

export function Whiteboard(): JSX.Element {
  const { state } = useWhiteboard();
  
  return (
    <div style={containerStyle}>
      <EventDrivenCanvas enablePointer={true} width="1024" height="1024" style={canvasStyle} controller={state.pointerPainter} />
      <EventDrivenCanvas width="1024" height="1024" style={canvasStyle} controller={state.remotePainter} />
      <Toolbar />
    </div>
  );
}
