import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'


const styles = (theme: IMyTheme) => createStyles({
    root: {},
})


interface IProps {
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    return (
        <p>Loading...</p>
    )
})) /* ============================================================================================================= */
