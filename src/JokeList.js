import React, { Component } from "react";
import axios from "axios";
import uuid from "uuid/dist/v4";
import Joke from "./Joke";
import "./JokeList.css";

const API_URL = "https://icanhazdadjoke.com/";

class JokeList extends Component {
  static defaultProps = {
    jokesToGet: 10,
  };
  constructor(props) {
    super(props);
    let origJokes = JSON.parse(window.localStorage.getItem("jokes") || "[]");
    let sortJokes = origJokes.sort((a,b) => b.votes - a.votes);
    this.state = {
      jokes: sortJokes,
      loading: false,
    };
    this._seenJokes = new Set(this.state.jokes.map((j) => j.text));
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    if (this.state.jokes.length === 0) {
      this.setState({ loading: true }, this.getJokes);
    }
  }

  async getJokes() {
      try{
    let jokes = [];
    while (jokes.length < this.props.jokesToGet) {
      let res = await axios.get(API_URL, {
        headers: {
          Accept: "application/json",
        },
      });
      let newJoke = res.data.joke;
      if (!this._seenJokes.has(newJoke)) {
        jokes.push({ id: uuid(), text: res.data.joke, votes: 0 });
      }
    }
    jokes = [...jokes, ...this.state.jokes]
    let sortJokes = jokes.sort((a,b) => b.votes - a.votes);
    this.setState(
      (st) => ({
        loading: false,
        jokes: [...sortJokes],
      }),
      () =>
        window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes))
    );}catch(e){
        alert(e);
        this.setState({loading:false});
    }
  }

  handleClick() {
    this.setState({ loading: true }, this.getJokes);
  }

  handleVote(id, delta) {
    this.setState(
      (st) => ({
        jokes: st.jokes.map((j) =>
          j.id === id ? { ...j, votes: j.votes + delta } : j
        ),
      }),
      () =>
        window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes))
    );
  }


  render() {
    if (this.state.loading) {
      return (
        <div className="JokeList-loader">
          <i className="far fa-6x fa-laugh fa-spin"></i>
          <h1 className="JokeList-title">Getting Jokes ....</h1>
        </div>
      );
    }
    return (
      <div className="JokeList">
        <div className="JokeList-sidebar">
          <h1 className="JokeList-title">
            <span>Dad</span> Jokes
          </h1>
          <img
            src="https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg"
            alt="emoji"
          />
          <button className="JokeList-getmore" onClick={this.handleClick}>
            Fetch Jokes
          </button>
        </div>
        <div className="JokeList-jokes">
          {this.state.jokes.map((joke) => (
            <Joke
              key={joke.id}
              text={joke.text}
              votes={joke.votes}
              upvote={() => this.handleVote(joke.id, 1)}
              downvote={() => this.handleVote(joke.id, -1)}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default JokeList;
