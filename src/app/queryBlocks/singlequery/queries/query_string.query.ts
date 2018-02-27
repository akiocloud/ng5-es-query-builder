import { Component, OnInit, OnChanges, Input, Output, EventEmitter, ViewChild, SimpleChange } from "@angular/core";

@Component({
	selector: 'query_string-query',
	templateUrl:'query_string.query.html',
	inputs: [ 'getQueryFormat', 'querySelector']
})

export class QueryStringQuery implements OnInit, OnChanges {
	@Input() queryList: any;
	@Input() selectedField: string;
	@Input() appliedQuery: any;
	@Input() selectedQuery: string;
	@Output() getQueryFormat = new EventEmitter < any > ();
	public current_query: string = 'query_string';
	public queryName = '*';
	public fieldName = '*';
	public information: any = {
		title: 'Query String',
		content: `<span class="description">Returns matches based on a query that uses a query parser in order to parse its content.</span>
					<a class="link" href="https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html#query-dsl-query-string-query">Read more</a>`
	};
	public informationList: any = {
		'default_field': {
			title: 'default_field',
			content: `<span class="description">The default field for query terms if no prefix field is specified.</span>`
		},
		'fields': {
			title: 'fields',
			content: `<span class="description">Specify one or more fields separated by comma to run a multi-field query.</span>`
		},
		'use_dis_max': {
			title: 'use_dis_max',
			content: `<span class="description">Should the queries be combined using dis_max (set it to true), or a bool query (set it to false). Defaults to true.</span>`
		}
	};
	public default_options: any = [
		'default_field',
		'fields',
		'use_dis_max'
	];
	public options: any;
	public placeholders: any = {
		fields: 'Comma separated values'
	};
	public singleOption = {
		name: '',
		value: ''
	};
	public optionRows: any = []

	constructor() {}

	public inputs: any = {
		input: {
			placeholder: 'Input',
			value: ''
		}
	};
	public queryFormat: any = {};

	ngOnInit() {
		this.options = JSON.parse(JSON.stringify(this.default_options));
		try {
			if (this.appliedQuery[this.current_query]) {
				var applied = this.appliedQuery[this.current_query];
				this.inputs.input.value = applied.query;
				if(applied.fields.length > 1) {
					var other_fields = JSON.parse(JSON.stringify(applied.fields));
					other_fields.splice(0, 1);
					other_fields = other_fields.join(',');
					var obj = {
						name: 'fields',
						value: other_fields
					};
					this.optionRows.push(obj);
				}

				for (let option in applied) {
					if (option != 'fields' && option != 'query') {
						var obj = {
							name: option,
							value: applied[option]
						};
						this.optionRows.push(obj);
					}
				}

			}
		} catch (e) {}
		this.getFormat();
	}

	ngOnChanges() {
		if (this.selectedField != '') {
			if (this.selectedField !== this.fieldName) {
				this.fieldName = this.selectedField;
				this.getFormat();
			}
		}
		if (this.selectedQuery != '') {
			if (this.selectedQuery !== this.queryName) {
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
			query: value,
			fields: [fieldname, other fields]
		}
	*/
	getFormat() {
		if (this.queryName === this.current_query) {
			this.queryFormat = this.setFormat();
			this.getQueryFormat.emit(this.queryFormat);
		}
	}
	setFormat() {
		var queryFormat = {};
		var fields = [this.fieldName];
		queryFormat[this.queryName] = {
			query: this.inputs.input.value,
			fields: fields
		};
		if(this.optionRows.length) {
			this.optionRows.forEach(function(singleRow: any) {
				if(singleRow.name != 'fields') {
					queryFormat[this.queryName][singleRow.name] = singleRow.value;
				} else {
					var field_split = singleRow.value.split(',');
					fields = fields.concat(field_split);
					queryFormat[this.queryName].fields = fields;
				}
			}.bind(this))
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
