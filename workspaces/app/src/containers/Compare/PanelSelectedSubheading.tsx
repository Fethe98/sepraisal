import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Button, Grid } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import { CONTEXT } from 'src/stores'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        width: '100%',
    },

    button: {
        color: theme.palette.text.secondary,
        margin: theme.spacing(-1.5, 0),  // Counter button padding, because it already has enough outer margin.
    },
})

interface IProps {
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const selectionStore = React.useContext(CONTEXT.SELECTION)

    const handleClear = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
        event.stopPropagation()  // Don't open the drawer.
        selectionStore.selected.replace([])
    }

    return (
        <Grid container justify='space-between' alignItems='baseline' className={classes.root}>
            {`${selectionStore.selected.length}`}
            &nbsp;
            <Button className={classes.button} onClick={handleClear}>clear</Button>
        </Grid>
    )
})) /* ============================================================================================================= */
