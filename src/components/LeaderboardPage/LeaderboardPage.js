/**
 * Created by thisara on 4/19/16.
 */
import React, { PropTypes, Component } from 'react';
import styles from './LeaderboardPage.css';
import withStyles from '../../decorators/withStyles';
import LeaderboardRow from './LeaderboardRow';
import _ from 'underscore';

@withStyles(styles)
class LeaderboardPage extends Component {

    static propTypes = {
        player: PropTypes.object
    };

    constructor() {
        super();
        this.state = {
            players:[]
        };
        this.handleNextButton= this.handleNextButton.bind(this);
    }

    componentDidMount() {
        $.ajax({
            method: 'GET',
            url: '/leaderboard/all',
            success: (data) => {
                this.setState({
                    players: data
                });
                console.log("leaderboard success " + JSON.stringify(data));
            },
            error: (xhr, status, err) => {
                console.error('', status, err.toString());
            }
        });
    }

    handleNextButton(e) {
        e.preventDefault();
        window.location.href = '/login';
    }

    render() {
            const rows = this.state.players.map(function(player) {
                return (<LeaderboardRow player = {player} key={player.rank} />);
            });

            return (
                <div className="leaderboard">
                    <div className="leaderboard-table">
                        <table className="table table-hover">
                            <tbody>
                            {rows}
                            </tbody>
                        </table>
                    </div>

                    <button className="btn-next" onClick={this.handleNextButton}> bÈßhg</button>
                </div>
            );
        }
}

export default LeaderboardPage;
