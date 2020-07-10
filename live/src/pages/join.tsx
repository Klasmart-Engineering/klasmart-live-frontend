import React, { useState, useContext } from 'react'
import { createStyles, makeStyles, useTheme } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import KidsloopLogo from "../assets/img/kidsloop.svg";
import CenterAlignChildren from '../components/centerAlignChildren'
import StyledButton from '../components/styled/button'
import StyledTextField from '../components/styled/textfield'
import { IUserContext, UserContext } from '../app'

const useStyles = makeStyles(() =>
    createStyles({
        container: {
            margin: 'auto 0'
        },
        card: {
            display: 'flex',
            alignItems: 'center',
            padding: '48px 40px !important'
        },
        formContainer: {
            width: '100%'
        },
        pageWrapper: {
            display: "flex",
            flexGrow: 1,
            height: "100vh",
        },
    })
)

export function Join (): JSX.Element {
    const classes = useStyles()
    const theme = useTheme();
    const [user, setUser] = useState<string>('')

    const {setName} = useContext(UserContext)
    
    return (
        <Grid
            container
            direction="column"
            justify="space-around"
            alignItems="center"
            className={ classes.pageWrapper }
        >
            <Container maxWidth="xs">
                <Card>
                    <CardContent className={classes.card}>
                        <Grid container direction="row" justify="center" alignItems="center" spacing={4}>
                            <Grid item xs={12}>
                                <CenterAlignChildren>
                                    <img alt="KidsLoop" src={KidsloopLogo} height="50px" />
                                    <Typography variant="h6" style={{ paddingLeft: theme.spacing(1) }}>
                                        Live
                                    </Typography>
                                </CenterAlignChildren>
                            </Grid>
                            <Grid item xs={12} className={classes.formContainer}>
                                <form onSubmit={(e) => { e.preventDefault(); setName(user) }}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <StyledTextField
                                                required
                                                fullWidth
                                                value={user}
                                                label={'What is your name?'}
                                                onChange={(e) => setUser(e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <StyledButton
                                                fullWidth
                                                type="submit"
                                                size="large"
                                            >
                                                <Typography>
                                                    Join Room
                                                </Typography>
                                            </StyledButton>
                                        </Grid>
                                    </Grid>
                                </form>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Container>
        </Grid>
    )
}

