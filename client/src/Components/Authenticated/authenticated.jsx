import styles from "@styles/authenticated.module.scss"


export const MainContainer = ({ children }) => (
  <div style={{ display: 'flex', height: '100vh' }}>{children}</div>
);

export const MenuContainer = ({ children }) => (
  <aside style={{ width: '250px', backgroundColor: '#f0f0f0' }}>{children}</aside>
);

export const ContentContainer = ({ children }) => (
  <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>{children}</main>
);

export const TopContainer = ({ children }) => (
  <div style={{ padding: '1rem', backgroundColor: '#ddd' }}>{children}</div>
);

export const UserContainer = ({ children }) => (
  <div style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>{children}</div>
);

export const Content = ({ children }) => (
  <div style={{ padding: '2rem' }}>{children}</div>
);
