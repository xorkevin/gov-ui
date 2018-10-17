import {h, Component} from 'preact';
import {formatStr} from 'utility';
import Tooltip from 'component/tooltip';

const Formatter = () => {
  if (Intl && Intl.DateTimeFormat) {
    return new Intl.DateTimeFormat(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short',
    });
  }
  return {
    format: (date) => {
      return date.toString();
    },
  };
};

const timeFormatter = Formatter();
const dateToLocale = (date) => {
  return timeFormatter.format(date);
};

const timeAgoFormatStrings = [
  /*0*/ ['just now', 'right now'],
  /*1*/ ['{0} seconds ago', 'in {0} seconds'],
  /*2*/ ['a minute ago', 'in 1 minute'],
  /*3*/ ['{0} minutes ago', 'in {0} minutes'],
  /*4*/ ['an hour ago', 'in 1 hour'],
  /*5*/ ['{0} hours ago', 'in {0} hours'],
  /*6*/ ['1 day ago', 'in 1 day'],
  /*7*/ ['{0} days ago', 'in {0} days'],
  /*8*/ ['1 month ago', 'in 1 month'],
  /*9*/ ['{0} months ago', 'in {0} months'],
  /*0*/ ['1 year ago', 'in 1 year'],
  /*1*/ ['{0} years ago', 'in {0} years'],
];

const sec15 = 15;
const min1 = 60;
const min2 = 120;
const hour1 = 3600;
const hour2 = 7200;
const day1 = 86400;
const day2 = 172800;
const month1 = 2592000;
const month2 = 5184000;
const year1 = 31556952;
const year1_1 = 34689600;

const timeAgo = (date) => {
  let diff = Date.now() - date.getTime();
  let future = 0;
  if (diff < 0) {
    future = 1;
    diff *= -1;
  }
  diff = Math.floor(diff / 1000);

  let k = 0;
  let num = diff;

  if (diff < sec15) {
    k = 0;
  } else if (diff < min1) {
    k = 1;
  } else if (diff < min2) {
    k = 2;
    num = Math.floor(num / min1);
  } else if (diff < hour1) {
    k = 3;
    num = Math.floor(num / min1);
  } else if (diff < hour2) {
    k = 4;
    num = Math.floor(num / hour1);
  } else if (diff < day1) {
    k = 5;
    num = Math.floor(num / hour1);
  } else if (diff < day2) {
    k = 6;
    num = Math.floor(num / day1);
  } else if (diff < month1) {
    k = 7;
    num = Math.floor(num / day1);
  } else if (diff < month2) {
    k = 8;
    num = Math.floor(num / month1);
  } else if (diff < year1) {
    k = 9;
    num = Math.floor(num / month1);
  } else if (diff < year1_1) {
    k = 10;
    num = Math.floor(num / year1);
  } else {
    k = 11;
    num = (num / year1).toFixed(1);
  }

  return formatStr(timeAgoFormatStrings[k][future], num);
};

class Time extends Component {
  constructor(props) {
    super(props);
    const k = new Date(props.value);
    this.state = {
      date: k,
      timeAgo: timeAgo(k),
      isoString: k.toISOString(),
      localeString: dateToLocale(k),
    };
  }

  tick() {
    this.setState((prevState) => {
      return Object.assign({}, prevState, {timeAgo: timeAgo(prevState.date)});
    });
  }

  componentWillReceiveProps(nextProps) {
    const k = new Date(nextProps.value);
    this.setState((prevState) => {
      return Object.assign({}, prevState, {
        date: k,
        timeAgo: timeAgo(k),
        isoString: k.toISOString(),
        localeString: dateToLocale(k),
      });
    });
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.tick();
    }, 60000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render({}, {isoString, localeString, timeAgo}) {
    return (
      <Tooltip tooltip={this.state.localeString}>
        <time dateTime={this.state.isoString}>{this.state.timeAgo}</time>
      </Tooltip>
    );
  }
}

export default Time;
