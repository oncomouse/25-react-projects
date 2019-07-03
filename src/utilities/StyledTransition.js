import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { CSSTransition } from 'react-transition-group';

const has = (key, obj) => Object.prototype.hasOwnProperty.call(obj, key);

const keyframes = [
  'appear',
  'enter',
  'exit',
  'appear-active',
  'enter-active',
  'exit-active',
  'appear-done',
  'enter-done',
  'exit-done',
]

const StyledTransition = styled(({ transitions, className, ...props }) => <CSSTransition className={className} classNames={className} {...props} />)`
  ${({transitions}) => keyframes.reduce((styles, keyframe) => {
    const objectKey = keyframe.replace(/(-[a-z])/, v => v.slice(1).toUpperCase());
    if (has(objectKey, transitions)) {
      return [...styles, css`
        &&-${keyframe} {
          ${transitions[objectKey]}
        }
      `];
    }
    return styles;
  }, [])
}`;

export default StyledTransition;