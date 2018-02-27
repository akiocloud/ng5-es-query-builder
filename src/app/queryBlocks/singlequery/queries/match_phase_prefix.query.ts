import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from "@angular/core";

@Component({
	selector: 'match-phase-prefix-query',
	templateUrl: 'match_phase_prefix.query.html',
	inputs: [ 'getQueryFormat', 'querySelector']
})

export class Match_phase_prefixQuery implements OnInit, OnChanges {
	@Input() queryList;
	@Input() selectedField;
	@Input() appliedQuery;
	@Input() selectedQuery;
	@Output() getQueryFormat = new EventEmitter<any>();
	public queryName = '*';
	public fieldName = '*';
	public current_query: string = 'match_phrase_prefix';
	public information: any = {
		title: 'Match Phrase with a Prefix',
		content: `<span class="description">Returns matches similar to Match Phrase except the last term of the query text can be a prefix.</span>
					<a class="link" href="https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-match-query-phrase-prefix.html#query-dsl-match-query-phrase-prefix">Read more</a>`
	};
	public informationList: any = {
		'analyzer': {
			title: 'analyzer',
			content: `<span class="description"><strong>analyzer</strong> can be set to control for the analysis process on the query text.</span>`
		},
		'max_expansions': {
			title: 'max_expansions',
			content: `<span class="description">The maximum number of terms that the query will expand to. Defaults to 50.</span>`
		}
	};
	public default_options: any = [
		'analyzer',
		'max_expansions'
	];
	public options: any
	public singleOption = {
		name: '',
		value: ''
	};
	public optionRows: any = [];

	public inputs: any = {
		input: {
			placeholder: 'Prefix',
			value: ''
		}
	};
	public queryFormat: any = {};

	ngOnInit() {
		this.options = JSON.parse(JSON.stringify(this.default_options));
		try {
			if(this.appliedQuery['match_phrase_prefix'][this.fieldName]) {
				if (this.appliedQuery[this.current_query][this.fieldName]) {
					this.inputs.input.value = this.appliedQuery[this.current_query][this.fieldName].query;
					for (let option in this.appliedQuery[this.current_query][this.fieldName]) {
						if (option != 'query') {
							var obj = {
								name: option,
								value: this.appliedQuery[this.current_query][this.fieldName][option]
							};
							this.optionRows.push(obj);
						}
					}
				} else {
					this.inputs.input.value = this.appliedQuery[this.current_query][this.fieldName];
				}
			}
		} catch(e) {}
		this.getFormat();
	}

	ngOnChanges() {
		if(this.selectedField != '') {
			if(this.selectedField !== this.fieldName) {
				this.fieldName = this.selectedField;
				this.getFormat();
			}
		}
		if(this.selectedQuery != '') {
			if(this.selectedQuery !== this.queryName) {
				this.queryName = this.selectedQuery;
				this.getFormat();
				this.optionRows = [];
			}
		}
	}

	// QUERY FORMAT
	/*
		Query Format for this query is
		@queryName: {
			@fieldName: @value
		}
	*/
	getFormat() {
		if (this.queryName === 'match_phrase_prefix') {
			this.queryFormat = this.setFormat();
			this.getQueryFormat.emit(this.queryFormat);
		}
	}
	setFormat() {
		var queryFormat = {};
		queryFormat[this.queryName] = {};
		if (this.optionRows.length) {
			queryFormat[this.queryName][this.fieldName] = {
				query: this.inputs.input.value
			};
			this.optionRows.forEach(function(singleRow: any) {
				queryFormat[this.queryName][this.fieldName][singleRow.name] = singleRow.value;
			}.bind(this))
		} else {
			queryFormat[this.queryName][this.fieldName] = this.inputs.input.value;
		}
		return queryFormat;
	}
	selectOption() {
		setTimeout(function() {
			this.getFormat();
		}.bind(this), 300);
	}
	addOption() {
		var singleOption = JSON.parse(JSON.stringify(this.singleOption));
		this.optionRows.push(singleOption);
	}
	removeOption(index: Number) {
		this.optionRows.splice(index, 1);
		this.getFormat();
	}
}
