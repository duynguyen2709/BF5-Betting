import type { ReactNode } from 'react';
import { Divider, Row } from 'antd';

import styles from './styles.module.css';

interface VerticalCenterRowCellWithDividerProps {
  children: ReactNode;
  arrayLength: number;
  index: number;
  margin?: string;
}

export function VerticalCenterRowCellWithDivider({
  children,
  arrayLength,
  index,
  margin = '0.5rem',
}: VerticalCenterRowCellWithDividerProps) {
  const isFirstEle = index === 0 && arrayLength > 0;
  const isNonLastEle = index < arrayLength - 1;

  let style;
  if (isFirstEle) {
    style = { marginBottom: margin };
  } else if (isNonLastEle) {
    style = { marginBottom: margin, marginTop: margin };
  } else {
    style = { marginTop: margin };
  }

  return (
    <>
      <Row className={styles['verticalCenterRow']} style={style}>
        {children}
      </Row>
      {isNonLastEle && <Divider style={{ margin: 0 }} />}
    </>
  );
}
