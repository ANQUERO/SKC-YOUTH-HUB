import React from 'react';
import style from '@styles/notfound.module.scss';
import { Link } from 'react-router-dom';
import Logo from '@images/logo.jpg';

const Container = ({ children }) => (
  <div className={style.container}>{children}</div>
);
const ErrorContainer = ({ children }) => (
  <div className={style.errorcontainer}>{children}</div>
);
const Message = ({ children }) => (
  <div className={style.message}>{children}</div>
);
const ErrorTitle = ({ children }) => (
  <div className={style.errortitle}>{children}</div>
);

const NotFound = () => {
  return (
    <Container>
      <img src={Logo} alt="Logo" className={style.backgroundLogo} />
      <ErrorContainer>
        <ErrorTitle>404 Page Not Found</ErrorTitle>

        <Message>
          Sorry, the page you’re looking for doesn’t exist. It might have been
          removed, renamed, or is temporarily unavailable.
        </Message>

        <Link to="/" className={style.link}>
          Go back to the homepage
        </Link>
      </ErrorContainer>
    </Container>
  );
};

export default NotFound;
