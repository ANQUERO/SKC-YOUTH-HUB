import React from 'react'
import style from '@styles/notfound.module.scss';

const Container = ({ children }) => (<div className={style.container}>{children}</div>);
const ErrorContainer = ({ children }) => (<div className={style.errorcontainer}>{children}</div>);
const Message = ({ children }) => (<div className={style.message}>{children}</div>);
const ErrorTitle = ({ children }) => (<div className={style.errortitle}>{children}</div>);

const NotFound = () => {
    return (
        <Container>
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
                        Go back to the homepage
                    </sl-button>
                </div>
            </ErrorContainer>

        </Container>
    )
}

export default NotFound