import './home.scss';

import React, { Fragment } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';

import { connect } from 'react-redux';
import { Card, CardBody, CardTitle, CardSubtitle, CardText, CardDeck, Button } from 'reactstrap';
import PieChart from 'react-minimal-pie-chart';

import { IAdvertisement } from 'app/shared/model/advertisement.model';
import { uniqueId } from 'app/shared/util/unique-id';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  getActiveEntities as getActiveAdvertisements,
  getEntitiesByProfession as getAdvertisementsByProfession,
  getEntitiesByProfessionByCurrentUser as getAdvertisementsByProfessionByCurrentUser
} from 'app/entities/advertisement/advertisement.reducer';
import {
  getEntitiesByProfession as getCandidatesByProfession,
  getEntitiesByProfessionByCurrentUser as getCandidatesByProfessionByCurrentUser
} from 'app/entities/candidate/candidate.reducer';

const colors = [
  'rgba(255, 99, 132, 0.8)',
  'rgba(54, 162, 235, 0.8)',
  'rgba(255, 206, 86, 0.8)',
  'rgba(75, 192, 192, 0.8)',
  'rgba(153, 102, 255, 0.8)',
  'rgba(255, 159, 64, 0.8)'
];

export interface IHomeProp extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export class Home extends React.Component<IHomeProp> {
  componentDidMount() {
    if (this.props.isAuthenticated) {
      if (this.props.account.authorities.some(auth => auth === 'ROLE_ADMIN')) {
        this.props.getAdvertisementsByProfession();
        this.props.getCandidatesByProfession();
      } else {
        this.props.getAdvertisementsByProfessionByCurrentUser();
        this.props.getCandidatesByProfessionByCurrentUser();
      }
    } else {
      this.props.getActiveAdvertisements();
    }
  }

  renderCompany(companyName: string) {
    if (companyName) {
      return (
        <Fragment>
          <FontAwesomeIcon icon="building" fixedWidth /> {companyName}
        </Fragment>
      );
    }
    return null;
  }

  renderProfession(professionName: string) {
    if (professionName) {
      return (
        <Fragment>
          <FontAwesomeIcon icon="briefcase" fixedWidth /> {professionName}
        </Fragment>
      );
    }
    return null;
  }

  renderAdvertisements = () => {
    const { activeAdvertisementList, match } = this.props;
    return activeAdvertisementList.map((ads: IAdvertisement) => {
      return (
        <Link key={uniqueId('home-advertisement')} to={`${match.url}advertisement/${ads.id}`} className="ads-card-wrapper">
          <Card body outline color="info" className="ads-card">
            <CardBody className="ads-card-body">
              <CardTitle className="ads-title">{ads.title}</CardTitle>
              <CardSubtitle className="ads-subtitle">
                {this.renderCompany(ads.user.companyName)}
                {this.renderProfession(ads.profession.name)}
              </CardSubtitle>
              <CardText className="ads-description">{ads.description}</CardText>
              <Button tag={Link} to={`${match.url}advertisement/${ads.id}/apply`} color="info" className="float-right">
                Apply
              </Button>
            </CardBody>
          </Card>
        </Link>
      );
    });
  };

  render() {
    const { account, advertisementsByProfession, candidatesByProfession } = this.props;

    if (account && account.login) {
      const advertisementsByProfessionData = advertisementsByProfession.map((ad, index) => ({
        title: ad.professionName,
        value: ad.adsCount,
        color: colors[index]
      }));
      const candidatesByProfessionData = candidatesByProfession.map((candidate, index) => ({
        title: candidate.professionName,
        value: candidate.candidatesCount,
        color: colors[index]
      }));

      return (
        <div className="home-charts">
          <div className="home-chart_wrapper">
            <h3>Active Advertisements By Profession</h3>
            <PieChart label className="ads-chart" data={advertisementsByProfessionData} />
          </div>
          <div className="home-chart_wrapper">
            <h3>Candidates By Profession</h3>
            <PieChart label className="ads-chart" data={candidatesByProfessionData} />
          </div>
        </div>
      );
    }

    return <CardDeck>{this.renderAdvertisements()}</CardDeck>;
  }
}

const mapStateToProps = storeState => ({
  account: storeState.authentication.account,
  isAuthenticated: storeState.authentication.isAuthenticated,
  activeAdvertisementList: storeState.advertisement.allActiveEntities,
  advertisementsByProfession: storeState.advertisement.entitiesByProfession,
  candidatesByProfession: storeState.candidate.entitiesByProfession
});

const mapDispatchToProps = {
  getActiveAdvertisements,
  getAdvertisementsByProfession,
  getCandidatesByProfession,
  getAdvertisementsByProfessionByCurrentUser,
  getCandidatesByProfessionByCurrentUser
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
