import styles from "@styles/authenticated.modules.scss"

export const MainContainer = ({ children }) => {
    <div className={styles.mainContainer}>
        {children}
    </div>
}

export const MenuContainer  = ({ children }) => {
    <div className={styles.menuContainer}>
        {children}
    </div>
}

export const ConetentContainer  = ({ children }) => {
    <div className={styles.conetentContainer}>
        {children}
    </div>
}

export const TopContainer  = ({ children }) => {
    <div className={styles.topContainer}>
        {children}
    </div>
}

export const UserContainer  = ({ children }) => {
    <div className={styles.userContainer}>
        {children}
    </div>
}

export const Content  = ({ children }) => {
    <div className={styles.content}>
        {children}
    </div>
}