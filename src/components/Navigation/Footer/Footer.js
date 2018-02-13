import React, { Component } from 'react';


class Footer extends Component {

    render() {
        const style = {
            position: 'fixed',
            height: '50px',
            bottom: 0,
            left: 0,
            right: 0,
            // paddingTop: "10px",
            marginTop: "10px",
            marginBottom: 0,
            backgroundColor: 'rgb(232, 232, 232)',
            zIndex: 1300,
            textAlign: "center",
            fontSize: "12px"
        };

        const styleText = {
            paddingTop: "5px"
        };

        return(
            <footer style={style}>
                <div class="footer-text">
                        <p style={styleText}>© 2017 by Healthcare Services Platform Consortium
                          • <a>Terms of Use &amp; Privacy Statement</a></p>
                </div>
            </footer>
        );
    };
}

export default Footer;





