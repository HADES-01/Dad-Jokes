import React from 'react';
import './menu-item.styles.scss'

const MenuItem = ({title, image, key, size}) => (
    <div key={key} className={`${size} menu-item`}>
        <div style={{
            background: `url(${image})`
        }} className="background-image">
        </div>
        <div className="content">
            <h1 className="title">{title}</h1>
            <span className="subtitle">Shop Now</span>
        </div>
    </div>
)

export default MenuItem;