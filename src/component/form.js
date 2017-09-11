import {h, Component} from 'preact';
import shortid from 'shortid';

class Input extends Component {
  constructor(props){
    super(props);
    this.state = {
      value: props.value,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleEnter = this.handleEnter.bind(this);
  }

  handleChange(event){
    this.setState((prevState)=>{
      return Object.assign({}, prevState, {value: event.target.value});
    });
    if(this.props.onChange){
      this.props.onChange(event.target.value);
    }
  }

  handleEnter(target) {
    if(this.props.onEnter && target.charCode==13){
      this.props.onEnter();
    }
  }

  render({valid, error, fullWidth, textarea, label, type, info}, {value}){
    const id = shortid.generate();
    let k = ["input"];
    if(valid){
      k.push("valid");
    } else if(error){
      k.push("invalid");
    }

    if(fullWidth){
      k.push("full-width");
    }

    return <div className={k.join(" ")}>
      {!textarea &&
        <input id={id} type={type} value={value} onInput={this.handleChange} onKeyPress={this.handleEnter} placeholder=" "/>}
      {textarea &&
         <textarea id={id} value={value} onInput={this.handleChange} onKeyPress={this.handleEnter} placeholder=" "></textarea>}
      <label htmlFor={id}>{label}</label>
      {!error && info && <span className="info">{info}</span>}
      {error && <span className="error">{error}</span>}
    </div>;
  }
}

export default Input
