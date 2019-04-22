import React, { Component } from 'react';
import withStyles from "@material-ui/core/styles/withStyles";

import { Timeline, Code, Group } from
    '@material-ui/icons';

import { withTranslation } from 'react-i18next';

import Header from 'views/Header/Header.jsx';
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";

import SectionInfo from 'views/SignupPage/Sections/SectionInfo.jsx';
import SectionForm from 'views/SignupPage/Sections/SectionForm.jsx';

import signupPageStyle from "assets/jss/material-kit-pro-react/views/signupPageStyle.jsx";

import image from "assets/img/bg7.jpg";

const Infos = (t) => {
    return [
        {
            'title': t('signupPage.infos.infoA.title'),
            'description': t('signupPage.infos.infoA.description'),
            'icon': Timeline,
            'iconColor': 'rose'
        },
        {
            'title': t('signupPage.infos.infoB.title'),
            'description': t('signupPage.infos.infoB.description'),
            'icon': Code,
            'iconColor': 'primary'
        },
        {
            'title': t('signupPage.infos.infoC.title'),
            'description': t('signupPage.infos.infoC.description'),
            'icon': Group,
            'iconColor': 'info'
        }
    ];
}

class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checked: [1]
        };
        this.handleToggle = this.handleToggle.bind(this);
    }

    handleToggle(value) {
        const { checked } = this.state;
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        this.setState({
            checked: newChecked
        });
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
    }

    render() {
        const { classes, t, ...rest } = this.props;
        const infos = Infos(t);

        return (
            <div>
                <Header
                    absolute
                    color='transparent'
                    {...rest}
                />
                <div
                    className={classes.pageHeader}
                    style={{
                        backgroundImage: 'url(' + image + ')',
                        backgroundSize: 'cover',
                        backgroundPosition: 'top center'
                    }}
                >
                    <div className={classes.container}>
                        <GridContainer justify='center'>
                            <GridItem xs={12} sm={10} md={10}>
                                <Card className={classes.cardsSignup}>
                                    <h2 className={classes.cardTitle}>{t('signupPage.title')}</h2>
                                    <CardBody>
                                        <GridContainer justify='center'>
                                            <SectionInfo infos={infos} classes={classes} />
                                            <SectionForm classes={classes} t={t} />
                                        </GridContainer>
                                    </CardBody>
                                </Card>
                            </GridItem>
                        </GridContainer>
                    </div>
                </div>
            </div>
        );
    }
}

export default withTranslation()(withStyles(signupPageStyle)(Signup));