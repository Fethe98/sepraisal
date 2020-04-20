import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { AppBar, Button, Toolbar, Typography, Badge } from '@material-ui/core'
import IconBuild from '@material-ui/icons/Build'
import IconInfo from '@material-ui/icons/Info'
import IconSearch from '@material-ui/icons/Search'

import { createSmartFC, createStyles, IMyTheme } from '../../common/'
import { ROUTES } from '../../constants/routes'
import { CONTEXT } from '../../stores'
import TopbarButton from './TopbarButton'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        // backgroundImage: `url('${background}')`,
        backgroundPosition: '0px -12px ',
        zIndex: theme.zIndex.appBar + 1,
    },

    badge: {
        right: theme.spacing(2),
        top: theme.spacing(2),
        padding: theme.spacing(2),
    },
    headline: {
        '@media (max-width: 750px)': {
            display: 'none',
        },
        color: 'white',
    },
    headlineSmall: {
        '@media (min-width: 750px)': {
            display: 'none',
        },
        color: 'white',
    },
})


interface IProps {
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const routerStore = React.useContext(CONTEXT.ROUTER)
    const selectionStore = React.useContext(CONTEXT.SELECTION)

    const h = (event: React.MouseEvent) => routerStore.goView(ROUTES.HOME)

    return (
        <AppBar elevation={0} className={classes.root}>
            <Toolbar>
                <Button onClick={h}>
                    <Typography variant='h5' className={classes.headlineSmall} noWrap>
                        {'SE Praisal'}
                    </Typography>
                    <Typography variant='h5' className={classes.headline} noWrap>
                        {'Space Engineers Praisal'}
                    </Typography>
                </Button>
                <div style={{flex: 1}} />
                <TopbarButton route={ROUTES.BROWSE} icon={<IconSearch/>} title='Browse' />
                <Badge classes={{badge: classes.badge}} badgeContent={selectionStore.selected.length} color="secondary">
                    <TopbarButton route={ROUTES.COMPARE} icon={<IconBuild/>} title='Compare' />
                </Badge>
                <TopbarButton route={ROUTES.INFO} icon={<IconInfo/>} title='Info' />
            </Toolbar>
        </AppBar>
    )
})) /* ============================================================================================================= */
