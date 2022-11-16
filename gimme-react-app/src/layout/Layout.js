import classes from "./Layout.module.scss";

function Layout(props) {
    return <div className={classes.Layout}>{props.children}</div>;
}

export default Layout;
