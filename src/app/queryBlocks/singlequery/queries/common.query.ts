import { Component, OnInit, OnChanges, Input, Output, EventEmitter, ChangeDetectionStrategy } from "@angular/core";

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'common-query',
	templateUrl: 'common.query.html',
	inputs: ['getQueryFormat', 'querySelector']
})

export class CommonQuery implements OnInit, OnChanges {
	@Input() queryList: any;
	@Input() selectedField: any;
	@Input() appliedQuery: any;
	@Input() selectedQuery: any;
	@Output() getQueryFormat = new EventEmitter<any>();
	public current_query: string = 'common';
	public queryName = '*';
	public fieldName = '*';
	public information: any = {
	title: 'Common Terms',
	content: `<span class="description">Returns common terms matches by avoiding noise from high frequency terms with a cutoff frequency parameter.</span>
				<a class="link" href="https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-common-terms-query.html#query-dsl-common-terms-query">Read more</a>`
	};
	public informationList: any = {
		'minimum_should_match': {
			title: 'minimum_should_match',
			content: `<span class="description">Specify a minimum number or % of low frequency terms which must be present in matches.</span>`
		},
		'low_freq_operator': {
			title: 'low_freq_operator',
			content: `<span class="description">Specify 'and' (defaults to 'or') to make all terms required.</span>`
		}
	};
	public default_options: any = [
		'low_freq_operator',
		'minimum_should_match'
	];
	public options: any;
	public singleOption = {
		name: '',
		value: ''
	};
	public optionRows: any = []


	public inputs: any = {
		query: {
			placeholder: 'Query',
			value: ''
		},
		cutoff_frequency: {
			placeholder: 'Cutoff frequency',
			value: ''
		}
	};
	public queryFormat: any = {};

	ngOnInit() {
		this.options = JSON.parse(JSON.stringify(this.default_options));
		try {
			if(this.appliedQuery['common'][this.fieldName]['query']) {
				this.inputs.query.value = this.appliedQuery['common'][this.fieldName]['query']
			}
			if(this.appliedQuery['common'][this.fieldName]['cutoff_frequency']) {
				this.inputs.cutoff_frequency.value = this.appliedQuery['common'][this.fieldName]['cutoff_frequency']
			}
			for (let option in this.appliedQuery[this.current_query][this.fieldName]) {
				if (['query','cutoff_frequency'].indexOf(option) === -1) {
					var obj = {
						name: option,
						value: this.appliedQuery[this.current_query][this.fieldName][option]
					};
					this.optionRows.push(obj);
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
				this.optionRows = [];
				this.getFormat();
			}
		}
	}

	addOption() {
		var singleOption = JSON.parse(JSON.stringify(this.singleOption));
		this.optionRows.push(singleOption);
	}

	// QUERY FORMAT
	/*
		Query Format for this query is
		@queryName: {
			@fieldName: {
				query: @query_value,
				cutoff_frequency: @cutoff_frequency_value
			}
		}
	*/
	getFormat() {
		if(this.queryName === 'common') {
			this.queryFormat = this.setFormat();
			this.getQueryFormat.emit(this.queryFormat);
		}
	}
	setFormat() {
		var queryFormat = {};
		queryFormat[this.queryName] = {};
		if (this.optionRows.length) {
			queryFormat[this.queryName][this.fieldName] = {
				query: this.inputs.query.value,
				cutoff_frequency: this.inputs.cutoff_frequency.value
			};
			this.optionRows.forEach(function(singleRow: any) {
				queryFormat[this.queryName][this.fieldName][singleRow.name] = singleRow.value;
			}.bind(this))
		} else {
			queryFormat[this.queryName][this.fieldName] = {
				query: this.inputs.query.value,
				cutoff_frequency: this.inputs.cutoff_frequency.value
			};
		}
		return queryFormat;
	}
	selectOption(input: any) {
		setTimeout(function() {
			this.getFormat();
		}.bind(this), 300);
	}
	removeOption(index: Number) {
		this.optionRows.splice(index, 1);
		this.getFormat();
	}
}
