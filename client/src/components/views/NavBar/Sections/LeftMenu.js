import React from 'react';
import { Menu } from 'antd';
import './Navbar.css';

function LeftMenu(props) {
  return (
    <Menu mode={props.mode} style={{ paddingLeft: '100px' }}>
      <Menu.Item key="mail">
        <a href="/" style={{ color: 'rgb(37, 141, 252)' }}>Home</a>
      </Menu.Item>
      <Menu.Item key="subscription">
        <a href="/subscription" style={{ color: 'rgb(37, 141, 252)' }}>Subscribed Videos</a>
      </Menu.Item>
    </Menu>
  )
}

export default LeftMenu;