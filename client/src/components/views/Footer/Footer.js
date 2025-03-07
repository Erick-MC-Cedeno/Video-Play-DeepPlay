import React from 'react';

function Footer() {
    return (
        <div style={{
            height: '80px', display: 'flex',
            flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', fontSize:'1rem', backgroundColor: 'black'
        }}>
           <p style={{color: 'rgb(37, 141, 252)'}}>
               by <a href="https://github.com/your-username" target="_blank" rel="noopener noreferrer" style={{color: 'rgb(37, 141, 252)'}}>Erick Cedeño</a>
			</p>
        </div>
    )
}

export default Footer;
