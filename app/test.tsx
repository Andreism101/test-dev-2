import React from 'react';
import fireBall from '../public/fire-ball2.png';
import Image from 'next/image';
import styles from './FireBall.module.css';

const FireBall: React.FC = () => {
  return (
    <div className={styles.container}>
      <Image src={fireBall} alt="Fire ball" width={50} height={50} />
      <span className={styles.number}>20</span>
    </div>
  );
};

export default FireBall;
