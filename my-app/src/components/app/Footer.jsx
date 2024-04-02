import React from 'react';
import style from './Footer.module.css';
import { Link } from 'react-router-dom';
const Footer = () => {
    return (
        <div className={style.footerContent}>
            <div className={style.contanierFooter}>
                <Link to='/' className={style.footerConduit}>conduit</Link><span>An interactive learning project from <a href="https://thinkster.io/">Thinkster</a>. Code & design licensed under MIT.</span>
            </div>
        </div>
    );
};

export default Footer;