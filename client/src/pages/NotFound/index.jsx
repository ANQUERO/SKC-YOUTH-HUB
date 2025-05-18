import React from 'react'
import style from '@styles/notfound.module.scss';
import { Link } from 'react-router-dom';
import Logo from '@images/logo.jpg'

const Container = ({ children }) => (<div className={style.container}>{children}</div>);
const ErrorContainer = ({ children }) => (<div className={style.errorcontainer}>{children}</div>);
const Message = ({ children }) => (<div className={style.message}>{children}</div>);
const ErrorTitle = ({ children }) => (<div className={style.errortitle}>{children}</div>);

const NotFound = () => {
    return (
        <Container>
            {/* Background logo */}
            <img
                src={Logo}
                alt="Logo"
                className={style.backgroundLogo}
            />
            <ErrorContainer>

                <ErrorTitle>
                    404 Page Not Found

                </ErrorTitle>

                <div>
                    <Message>
                        Sorry but the page you are looking for does not exist.
                        It may have been removed, had its name changed, or is
                        temporarily unavailable.
                    </Message>

                </div>

                <div>
                    <sl-button variant="primary">
                        <Link to={"/"} className={style.link}>
                        Go back to the homepage
                        </Link>
                    </sl-button>
                </div>
            </ErrorContainer>

        </Container>
    )
}

export default NotFound