import React from "react";
import ReactDOM from "react-dom/client";
import fruits from "./fruits.json";
import "./styles.css";

function ListItem(props) {
	return (
		<li value={props.value}>
			{props.content}
		</li>
	);
}

function List(props) {
	return (
		<ol>
			{ props.fruits.map(fruit =>
				<ListItem fruit={fruit} key={fruit} value={fruit} content={fruit} />
			) }
		</ol>
	);
}

function Search(props) {
	return (
		<input onChange={props.onChange} type="search" placeholder="Wyszukaj..." />
	);
}

function RadioWidget(props) {
	return (
		<label className="radio-widget">
			<input type="radio" rkey={props.attrs.key} name={props.name}
				defaultChecked={props.checked ? true : false} onChange={props.attrs.onChange} />
			<span>{props.attrs.descr}</span>
		</label>
	);
}

function RadioArea(props) {
	return (
		<div className="radio-area">
			<p className="descr">Wybierz metodę dopasowywania: </p>
			{
				props.options.map((opt, i) =>
					<RadioWidget key={opt.key} attrs={opt} name={props.name} checked={props.checked === i} />
				)
			}
		</div>
	);
}

class Widget extends React.Component {

	static filteringMethodNames = ["startsWith", "includes", "endsWith"];
	static filteringMethodNames_descr = ["zaczyna", "zawiera", "kończy"];

	crMethods() {
		return this.constructor.filteringMethodNames.map((name, i) => {
			return {
				key: i,
				onChange: e => this.onMethodChange(e),
				descr: this.constructor.filteringMethodNames_descr[i],
			};
		});
	}
	
	constructor(props) {
		super(props);
		this.allFruits = props.fruits;
		this.state = {
			keyword: "",
			filteringMethod: 0,
		};
	}

	onMethodChange(e) {
		this.setState({
			...this.state,
			filteringMethod: e.target.getAttribute("rkey"),
		})
	}

	match(names, sought, methodName) {
		return names.filter(name => name[methodName](sought));
	}	

	onInputValueChange(e) {
		const inputValue = e.target.value;
		this.setState({
			...this.state,
			keyword: inputValue,
		});
	}
	
	render() {
		const method = this.constructor.filteringMethodNames[this.state.filteringMethod];
		const filtered = this.match(this.allFruits, this.state.keyword, method);
		return (
			<div className="widget">
				<Search onChange={e => this.onInputValueChange(e)}/> <br/>
				<RadioArea options={this.crMethods()} name="method" checked={this.state.filteringMethod} />
				<List fruits={filtered}/>
			</div>
		);
	}
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Widget fruits={fruits}/>);
