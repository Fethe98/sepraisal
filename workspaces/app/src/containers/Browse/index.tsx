import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import IconFilter from 'src/components/icons/IconFilter'
import Search from 'src/components/Search'
import DefaultLayout from 'src/layouts/DefaultLayout'

import Cards from './Cards'
import Filter from './Filter'
import LoadMore from './LoadMore'


const styles = (theme: IMyTheme) => createStyles({
    root: {
    },

    search: {
        padding: theme.spacing(2, 14, 2, 0),
        maxWidth: '100%',
    },
})


interface IProps {
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {

    return (
        <DefaultLayout
            className={classes.root}
            aside={<Filter />}
            asideIcon={<IconFilter fontSize='default' />}
            asideTitle='Filters'
        >
            <Search className={classes.search} />
            <Cards />
            <LoadMore />
        </DefaultLayout>
    )
})) /* ============================================================================================================= */
