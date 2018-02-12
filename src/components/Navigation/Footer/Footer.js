import React, { Component } from 'react';


class Footer extends Component {

    render() {
        const style = {
            position: 'fixed',
            height: '50px',
            bottom: 0,
            left: 0,
            right: 0,
            marginBottom: 0,
            backgroundColor: 'rgb(232, 232, 232)',
            zIndex: 1300

        };

        return(
            <footer style={style}>
                <div>
                    <div>
                        © 2017 by Healthcare Services Platform Consortium
                        <div> • <a>Terms of Use &amp; Privacy Statement</a></div>
                        <div>
                    </div>
                    </div>
                </div>
            </footer>
        );
    };
}

export default Footer;





