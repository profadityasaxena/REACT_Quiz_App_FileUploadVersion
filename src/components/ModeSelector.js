import React from 'react';

const ModeSelector = ({ mode, onModeChange }) => {
  return (
    <div style={{ margin: '20px' }}>
      <label>
        <input
          type="radio"
          name="mode"
          value="practice"
          checked={mode === 'practice'}
          onChange={() => onModeChange('practice')}
        />
        Practice Mode
      </label>
      <label style={{ marginLeft: '20px' }}>
        <input
          type="radio"
          name="mode"
          value="test"
          checked={mode === 'test'}
          onChange={() => onModeChange('test')}
        />
        Test Mode
      </label>
    </div>
  );
};

export default ModeSelector;
