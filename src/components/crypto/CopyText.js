import React, { useState } from 'react';
import { Toast } from 'react-bootstrap';
import styles from './copytext.module.scss';
import {
  copyStrToClipboard,
  strCenterEllipsis
}  from '../../utils/strings';
import CopyIcon from '../../assets/copy-icon.svg';

export default props => {
  const {
    text,
    label,
    toastText,
    icon,
    ellipsis
  } = props;
  const [showToast, setShowToast] = useState(false);

  const handleCopy = () => {
    copyStrToClipboard(text || label);
    setShowToast(true);
  };

  return (
    <span
      className={styles.wrapper}
    >
      {toastText &&
        <div className={styles.copyTextToastWrapper}>
          <Toast
            className={styles.copyTextToast}
            onClose={() => setShowToast(false)}
            show={showToast}
            delay={1000}
            autohide
          >
            <Toast.Header closeButton={false}>
              {toastText}
            </Toast.Header>
          </Toast>
        </div>
      }
      {icon &&
        <img
          src={icon}
          width='18px'
          height='18px'
          alt={label}
          className={styles.iconLeft}
        />
      }
      {ellipsis ? strCenterEllipsis(label) : label}
      <img
        onClick={handleCopy}
        src={CopyIcon}
        width='16px' height='16px'
        alt='Copy'
        className={styles.iconCopy}
      />
    </span>
  )
};
